import Lottie from 'lottie-web';

import successAnimation from '../../animations/success.json'
import alertAnimation from '../../animations/alert.json'
import infoAnimation from '../../animations/info.json'
import helloAnimation from '../../animations/hello.json'
import dotsWhiteAnimation from '../../animations/dots-white.json'
import dotsVioletAnimation from '../../animations/dots-violet.json'
import dotsTealAnimation from '../../animations/dots-teal.json'
import loadingAnimation from '../../animations/loading.json'

// Use Lottie to load animation based on categories
const loadAnimation = (container, category) => {
    let animationData = null

    switch (category) {
        case 'success':
            animationData = successAnimation
            break
        case 'error':
            animationData = alertAnimation
            break
        case 'info':
            animationData = infoAnimation
            break
        case 'hello':
            animationData = helloAnimation
            break
        case 'dots-white':
            animationData = dotsWhiteAnimation
            break
        case 'dots-violet':
            animationData = dotsVioletAnimation
            break
        case 'dots-teal':
            animationData = dotsTealAnimation
            break
        case 'loading':
            animationData = loadingAnimation
            break
        default:
            animationData = null
    }

    Lottie.loadAnimation({
        container,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid meet'
        }
    })
}

export default loadAnimation