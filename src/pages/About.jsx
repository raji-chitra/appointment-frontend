import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { useContext } from 'react'

const About = () => {
  const { user } = useContext(AppContext)

  return (
    <div>
      {/* About Section Heading */}
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>
          ABOUT <span className='text-gray-700 font-medium'>US</span>
        </p>
      </div>

      {/* About Content */}
      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img
          className='w-full md:max-w-[360px]'
          src={assets.about_image}
          alt=''
        />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
          <p>
            Welcome to Prescripto, your trusted partner in managing your
            healthcare needs conveniently and efficiently. We are more than just
            a scheduling platform – we are a bridge between patients and doctors,
            ensuring that quality healthcare is just a few clicks away.
          </p>
          <p>
            Prescripto is committed to excellence in healthcare technology. We
            continuously strive to bring you innovative solutions that make
            healthcare accessible and hassle-free. From appointment booking to
            digital health records, our services are designed to remove barriers
            and save you valuable time.
          </p>
          <p>
            With Prescripto, you can find experienced doctors near you, book
            appointments instantly, and receive timely reminders – all while
            enjoying a secure and user-friendly experience. Our goal is to
            empower you to take charge of your health with confidence and ease.
          </p>
          <b className='text-gray-800'>Our Vision</b>
          <p>
            Our vision at Prescripto is to create a seamless healthcare
            experience for everyone, breaking barriers and fostering wellness in
            communities we serve. We believe that healthcare should be simple,
            personalized, and available to all, no matter where you are.
          </p>
          <p>
            By combining technology with compassion, we are working to build a
            future where managing your health is no longer a burden but a smooth
            and empowering journey.
          </p>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className='text-xl my-4'>
        <p>
          WHY{' '}
          <span className='text-gray-700 font-semibold'>CHOOSE US</span>
        </p>
      </div>

      <div className='flex flex-col md:flex-row mb-20'>
        {/* Efficiency */}
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px]'>
          <b>Efficiency:</b>
          <p>
            Streamlined appointment scheduling that fits into your busy
            lifestyle, helping you spend more time on what matters most.
          </p>
        </div>

        {/* Convenience */}
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px]'>
          <b>Convenience:</b>
          <p>
            Access to a network of trusted healthcare professionals in your
            area, with everything available from the comfort of your home.
          </p>
        </div>

        {/* Personalization */}
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px]'>
          <b>Personalization:</b>
          <p>
            Tailored recommendations, reminders, and insights to help you stay
            on top of your health and achieve your wellness goals.
          </p>
        </div>
      </div>
    </div>
  )
}

export default About
