import { useState, useRef, useEffect } from "react"
import Lottie from "lottie-react"
import { timeline } from '@motionone/dom'
const animationALoader = () => import('../assets/Animation-1.json')
const animationBLoader = () => import('../assets/Animation-2.json')

function MainScreen() {
    const textRef = useRef(null)
    const imgRef = useRef(null)
    const [animationA, setAnimationA] = useState(null)
    const [animationB, setAnimationB] = useState(null)
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768)
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-pop-in')
                } else {
                    entry.target.classList.remove('animate-pop-in')
                }
            })
        }, { threshold: 0.3 })

        if (imgRef.current) {
            observer.observe(imgRef.current)
        }

        return () => {
            if (imgRef.current) {
                observer.unobserve(imgRef.current)
            }
        }
    }, [])

    useEffect(() => {
        animationALoader().then((anim) => setAnimationA(anim.default))
        animationBLoader().then((anim) => setAnimationB(anim.default))
    }, [])

    useEffect(() => {
        const svg = textRef.current

        const letters = Array.from(svg.querySelectorAll('text path'))
        const animation = timeline(letters.map((letter, i) => [
            letter,
            { strokeDashoffset: [letter.getTotalLength(), 0] },
            { duration: 4, delay: i * 0.25, fill: 'forwards' }
        ]))

        return () => animation.stop()
    }, [])

    return (
        <div className="h-full w-full z-40 relative">
            <div className="relative px-4  md:px-0 pt-4 h-full w-full flex flex-col justify-center items-center">
                {animationA && <Lottie animationData={animationA} className="fixed optimse bottom-0 md:-bottom-60 z-0 scale-150 md:scale-100" />}
                {isMobile && animationA && (
                    <Lottie animationData={animationA} className="fixed optimse -top-24 md:-bottom-60 z-0 scale-150 md:scale-100" />
                )}
                {!isMobile && animationB && (
                    <Lottie animationData={animationB} className="fixed optimse top-0 md:-top-28 md:right-0 z-0 scale-150 md:scale-100" />
                )}
                <svg
                    ref={textRef}
                    viewBox="0 0 150 40"
                    className="h-24 w-full text-center"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.1"
                >
                    <text x="75" y="35" textAnchor="middle" className="text-stone-300 font-poppins font-extrabold text-2xl md:text-5xl">
                        <tspan className="stroke-dasharray">VENTURA</tspan>
                    </text>
                </svg>
                <p className='text-md pt-5 md:text-3xl font-semibold font-poppins text-stone-300 text-center pb-4 tracking-wide '>Brought to you by ECELL GEC in Collaboration with Vibrant Goa</p>
                <div className="box optimse">
                    <img
                        ref={imgRef}
                        src="/vibrantgoa.png"
                        alt="vibrantgoa"
                        className="h-20 optimse z-40 md:h-48 w-auto opacity-0 scale-50"
                    />
                </div>
            </div>
        </div>
    )
}

export default MainScreen