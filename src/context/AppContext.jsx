import { createContext, useState, useEffect } from "react";
import { doctors as localDoctors } from "../assets/assets";
import { authAPI, appointmentsAPI, publicAPI } from "../services/api";
import { toast } from 'react-toastify';

export const AppContext = createContext()

const AppContextProvider = (props) => {
    const currencySymbol = '₹'

    // Format amount into INR currency string. Accepts number or numeric string.
    const formatCurrency = (amount) => {
        if (amount == null || amount === '') return '-'
        const num = Number(amount)
        if (isNaN(num)) return amount
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num)
    }

    // User authentication state
    const [token, setToken] = useState(() => {
        const savedToken = localStorage.getItem('token')
        // Clear any invalid tokens
        if (savedToken === 'false' || savedToken === 'null' || savedToken === 'undefined') {
            localStorage.removeItem('token')
            localStorage.removeItem('userData')
            return false
        }
        return savedToken || false
    })
    const [userData, setUserData] = useState(null)

    // User appointments state
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(false)

    // Load user data from localStorage on component mount
    useEffect(() => {
        if (token) {
            const savedUserData = localStorage.getItem('userData')
            if (savedUserData) {
                try {
                    setUserData(JSON.parse(savedUserData))
                } catch (error) {
                    console.error('Error parsing saved user data:', error)
                    // Clear invalid data
                    localStorage.removeItem('userData')
                    localStorage.removeItem('token')
                    setToken(false)
                }
            }
        } else {
            setUserData(null)
        }
    }, [token])

    // Signup function
    const signup = async (userInfo, password) => {
        console.log('Signup function called with:', { userInfo })
        setLoading(true)

        try {
            const response = await authAPI.signup({
                name: userInfo.name,
                email: userInfo.email,
                password: password
            })

            console.log('Signup response:', response)

            // Normalize message to string to avoid passing objects to toast
            const respMessage = typeof response?.message === 'string' ? response.message : JSON.stringify(response?.message || '')

            if (response.success) {
                // Update localStorage immediately
                localStorage.setItem('token', response.token)
                localStorage.setItem('userData', JSON.stringify(response.user))

                console.log('Stored token:', response.token)
                console.log('Stored userData:', JSON.stringify(response.user))

                // Update state immediately
                setToken(response.token)
                setUserData(response.user)

                console.log('Signup completed successfully')
                return { success: true, message: respMessage }
            } else {
                // Handle API response with success: false
                console.log('Signup failed with response:', response)
                return { success: false, message: respMessage || 'Account creation failed' }
            }
        } catch (error) {
            console.error('Error during signup:', error)
            // Coerce possible structured error message to string
            const errMsg = error?.response?.data?.message || error?.message || 'Signup failed'
            const finalMsg = typeof errMsg === 'string' ? errMsg : JSON.stringify(errMsg)
            return { success: false, message: finalMsg }
        } finally {
            setLoading(false)
        }
    }

    // Login function
    const login = async (email, password) => {
        console.log('Login function called with email:', email)
        setLoading(true)

        try {
            const response = await authAPI.login({
                email: email,
                password: password
            })

            console.log('Login response:', response)
            const respMessage = typeof response?.message === 'string' ? response.message : JSON.stringify(response?.message || '')

            if (response.success) {
                // Update localStorage immediately
                localStorage.setItem('token', response.token)
                localStorage.setItem('userData', JSON.stringify(response.user))

                // Update state immediately
                setToken(response.token)
                setUserData(response.user)

                console.log('Login completed successfully')
                return { success: true, message: respMessage }
            } else {
                // Handle API response with success: false
                console.log('Login failed with response:', response)
                return { success: false, message: respMessage || 'Login failed' }
            }
        } catch (error) {
            console.error('Error during login:', error)
            const errMsg = error?.response?.data?.message || error?.message || 'Login failed'
            const finalMsg = typeof errMsg === 'string' ? errMsg : JSON.stringify(errMsg)
            return { success: false, message: finalMsg }
        } finally {
            setLoading(false)
        }
    }

    // Book appointment function
    const bookAppointment = async (appointmentData) => {
        console.log('Booking appointment:', appointmentData)
        setLoading(true)

        try {
            const response = await appointmentsAPI.bookAppointment(appointmentData)

            if (response.success) {
                // Refresh appointments list
                    await getMyAppointments()
                    console.log('Appointment booked successfully, returning success')
                    // Redirect to My Appointments so user sees the booking immediately
                    try {
                        setTimeout(() => {
                            window.location.href = '/my-appointments'
                        }, 300)
                    } catch (e) {
                        console.warn('Redirect to /my-appointments failed after booking', e)
                    }
                    return { success: true, message: response.message, appointment: response.appointment }
            }
        } catch (error) {
            console.error('Error booking appointment:', error)
            toast.error(error.message || 'Failed to book appointment')
            throw new Error(error.message || 'Booking failed')
        } finally {
            setLoading(false)
        }
    }

    // Get user's appointments
    const getMyAppointments = async () => {
        // Check for token in state or localStorage
        const storedToken = !token && localStorage.getItem('token') ? localStorage.getItem('token') : token;
        
        if (!storedToken) {
            console.log('No token available, skipping appointment fetch')
            return []
        }

        console.log('Fetching appointments...')
        setLoading(true)

        try {
            const response = await appointmentsAPI.getMyAppointments()
            console.log('Appointments response:', response)

            if (response.success) {
                setAppointments(response.appointments || [])
                console.log('Appointments updated in context:', response.appointments)
                return response.appointments
            } else {
                console.error('Failed to fetch appointments:', response.message)
                setAppointments([])
                return []
            }
        } catch (error) {
            console.error('Error fetching appointments:', error)
            setAppointments([])
            return []
        } finally {
            setLoading(false)
        }
    }

    // Cancel appointment
    const cancelAppointment = async (appointmentId) => {
        console.log('Context: Cancelling appointment:', appointmentId)
        setLoading(true)

        try {
                const response = await appointmentsAPI.cancelAppointment(appointmentId)
                console.log('Context: Cancel response:', response)

                if (response.success) {
                    // Refresh the appointments list from server to keep state consistent
                    try {
                        await getMyAppointments()
                    } catch (err) {
                        // If refresh fails, fall back to a safe local update
                        console.warn('Context: Failed to refresh appointments after cancel, applying local fallback', err)
                        setAppointments(prev => {
                            if (!Array.isArray(prev)) return []
                            return prev.map(appointment =>
                                appointment._id === appointmentId
                                    ? { ...appointment, status: 'cancelled' }
                                    : appointment
                            )
                        })
                    }

                    console.log('Context: Appointment cancelled and state refreshed')
                    // Give UI a moment to update, then redirect to My Appointments
                    try {
                        setTimeout(() => {
                            window.location.href = '/my-appointments'
                        }, 300)
                    } catch (e) {
                        console.warn('Redirect to /my-appointments failed', e)
                    }
                    return { success: true, message: response.message }
                } else {
                    console.error('Context: Cancel failed:', response.message)
                    return { success: false, message: response.message || 'Failed to cancel appointment' }
                }
        } catch (error) {
            console.error('Context: Error cancelling appointment:', error)
            return { success: false, message: error.message || 'Failed to cancel appointment' }
        } finally {
            setLoading(false)
        }
    }

    // Update payment status
    const updatePayment = async (appointmentId, paymentData) => {
        setLoading(true)

        try {
            const response = await appointmentsAPI.updatePayment(appointmentId, paymentData)

            if (response.success) {
                // Refresh appointments list
                await getMyAppointments()
                toast.success(response.message)
                return { success: true, message: response.message }
            }
        } catch (error) {
            console.error('Error updating payment:', error)
            toast.error(error.message || 'Failed to update payment')
            throw new Error(error.message || 'Payment update failed')
        } finally {
            setLoading(false)
        }
    }

    // Logout function
    const logout = () => {
        setToken(false)
        setUserData(null)
        setAppointments([])
        localStorage.removeItem('token')
        localStorage.removeItem('userData')
        // Navigate to role selection page
        window.location.href = '/choose-login'
    }

    // Load appointments when user logs in
    useEffect(() => {
        if (token && userData) {
            getMyAppointments()
        }
    }, [token, userData])

    const [doctors, setDoctors] = useState([])

    useEffect(() => {
        (async () => {
            try {
                const res = await publicAPI.getDoctors()
                if (res.success && Array.isArray(res.doctors) && res.doctors.length > 0) {
                    setDoctors(res.doctors)
                    // Store doctors in localStorage for BookAppointment page
                    localStorage.setItem('doctors', JSON.stringify(res.doctors))
                } else {
                    console.warn('No doctors returned from API, using fallback data')
                    setDoctors(localDoctors)
                    // Store fallback doctors in localStorage
                    localStorage.setItem('doctors', JSON.stringify(localDoctors))
                }
            } catch (e) {
                console.error('Failed to load doctors', e)
                setDoctors(localDoctors)
                // Store fallback doctors in localStorage
                localStorage.setItem('doctors', JSON.stringify(localDoctors))
            }
        })()
    }, [])

    const value = {
        doctors,
    currencySymbol,
    formatCurrency,
        token,
        setToken,
        userData,
        setUserData,
        appointments,
        loading,
        signup,
        login,
        logout,
        bookAppointment,
        getMyAppointments,
        cancelAppointment,
        updatePayment
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider