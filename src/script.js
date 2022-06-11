import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import gsap from 'gsap'
import { Light } from 'three'

/**
 * Debug
 */
/* const gui = new dat.GUI() */

const parameters = {
    materialColor: '#7a3333'
}
/* 
gui
    .addColor(parameters, 'materialColor')
    .onChange(() => {
        material.color.set(parameters.materialColor)
        particlesMaterial.color.set(parameters.materialColor)
    })
 */
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
// Texture
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('textures/gradients/5.jpg')
gradientTexture.magFilter = THREE.NearestFilter

// Material
const material = new THREE.MeshToonMaterial({ 
    color: parameters.materialColor,
    gradientMap: gradientTexture
})

// 3D models
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

// Groups
// Camera group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// 3d objects group
const guitarsGroup = new THREE.Group()
const stratoGroup = new THREE.Group()
const lesPaulGroup = new THREE.Group()

gltfLoader.load(
    '/models/Guitars/Guitars.glb',
    (gltf) => {
        gltf.scene.position.y = -0.12
        gltf.scene.scale.set(2, 2, 2)
        guitarsGroup.add(gltf.scene)
    }
)
scene.add(guitarsGroup)

gltfLoader.load(
    '/models/FenderStrato/FenderStrato.glb',
    (gltf) => {
        gltf.scene.scale.set(2, 2, 2)
        gltf.scene.position.z = 5
        gltf.scene.rotation.x = Math.PI * 0.5
        gltf.scene.rotation.y = Math.PI * 0.5
        stratoGroup.add(gltf.scene)
    }
)
scene.add(stratoGroup)

gltfLoader.load(
    '/models/LesPaul/LesPaul.glb',
    (gltf) => {
        gltf.scene.scale.set(.5, .5, .5)
        gltf.scene.position.z = .6
        gltf.scene.rotation.x = Math.PI * .5
        lesPaulGroup.add(gltf.scene)
    }
)
scene.add(lesPaulGroup)

// Meshes
const objectsDistance = 11

stratoGroup.position.y = -3.2
lesPaulGroup.position.y = -17

const sectionMeshes = [ guitarsGroup, stratoGroup, lesPaulGroup ]

// Particles
// Geometry
const particlesCount = 1200
const positions = new Float32Array(particlesCount * 3)

for(let i = 0; i < particlesCount; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance  * sectionMeshes.length
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

// Material
const particlesMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    sizeAttenuation: true,
    size: 0.03
})

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

// Lights
const pointLight = new THREE.PointLight(0xffffff)
pointLight.intensity = 2
pointLight.decay = 100
pointLight.position.set(50, 50, 50)
cameraGroup.add(pointLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Scroll animation
let scrollY = window.scrollY
let currentSection = 0

window.addEventListener('scroll', () => {
    scrollY = window.scrollY

    const newSection = Math.floor(scrollY / sizes.height)

    if(newSection != currentSection){
        currentSection = newSection

        if(currentSection >= 1 && currentSection <= 6) {
            /* gsap.to(
                sectionMeshes[currentSection].rotation,{
                    duration: 1.5,
                    ease: 'power2.inOut',
                    x: '+=6',
                    y: '+=3'
                }
            ) */
            switch(currentSection) {
                case 1:
                        gsap.to(
                            stratoGroup.position,{
                                duration: 2.5,
                                x: '0',
                                y: '-3.2',
                                z: '0'
                            }
                        )
                        gsap.to(
                            stratoGroup.rotation,{
                                duration: 2.5,
                                z: '0'
                            }
                        )
                    break;
                case 2:
                        gsap.to(
                            stratoGroup.position,{
                                duration: 4,
                                x: '-0.4',
                                y: '-6.3',
                                z: '-1.2'
                            }
                        )
                        gsap.to(
                            stratoGroup.rotation,{
                                duration: 2.5,
                                z: '0.5'
                            }
                        )
                    break;
                case 3:
                        gsap.to(
                            stratoGroup.position,{
                                duration: 3,
                                y: '-8'
                            }
                        )
                    break;
                case 4:
                        gsap.to(
                            stratoGroup.position,{
                                duration: 3,
                                x: '0',
                                y: '-9.2',
                                z: '0'
                            }
                        )
                        gsap.to(
                            stratoGroup.rotation,{
                                duration: 2.5,
                                z: '0.5'
                            }
                        )
                    break;
                case 5:
                        gsap.to(
                            stratoGroup.position,{
                                duration: 3,
                                x: '-1',
                                y: '-12.1',
                                z: '-1'
                            }
                        )
                        gsap.to(
                            stratoGroup.rotation,{
                                duration: 2.5,
                                z: '0.5'
                            }
                        )
                    break;
                case 6:
                        gsap.to(
                            stratoGroup.position,{
                                duration: 3,
                                x: '-0.3',
                                y: '-13.9',
                                z: '-1.5'
                            }
                        )
                        gsap.to(
                            stratoGroup.rotation,{
                                duration: 2.5,
                                x: '0',
                                y: '0',
                                z: '0'
                            }
                        )
                    break;
            }
        } else {
            switch(currentSection) {
                case 7:
                    gsap.to(
                        lesPaulGroup.position,{
                            duration: 2.5,
                            x: '0',
                            y: '-17',
                            z: '0'
                        }
                    )
                    gsap.to(
                        lesPaulGroup.rotation,{
                            duration: 2.5,
                            x: '0',
                            y: '0',
                            z: '0'
                        }
                    )
                    break;
                case 8:
                        gsap.to(
                            lesPaulGroup.position,{
                                duration: 4,
                                x: '-1.8',
                                y: '-19.5',
                                z: '-6'
                            }
                        )
                        gsap.to(
                            lesPaulGroup.rotation,{
                                duration: 2.5,
                                z: '0.5'
                            }
                        )
                    break;
                case 9:
                        gsap.to(
                            lesPaulGroup.position,{
                                duration: 3,
                                x: '0.4',
                                y: '-21',
                                z: '0'
                            }
                        )
                        gsap.to(
                            lesPaulGroup.rotation,{
                                duration: 2.5,
                                z: '0.5'
                            }
                        )  
                    break;
                case 10:
                        gsap.to(
                            lesPaulGroup.position,{
                                duration: 3,
                                x: '-4',
                                y: '-25',
                                z: '-1'
                            }
                        )
                        gsap.to(
                            lesPaulGroup.rotation,{
                                duration: 2.5,
                                z: '0.5'
                            }
                        )
                    break;
                case 11:
                        gsap.to(
                            lesPaulGroup.position,{
                                duration: 3,
                                x: '-2.2',
                                y: '-28',
                                z: '-8'
                            }
                        )
                        gsap.to(
                            lesPaulGroup.rotation,{
                                duration: 2.5,
                                x: '0',
                                y: '0',
                                z: '0'
                            }
                        )
                    break;
            }
        }
    }
})

// Cursor
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) => {
    cursor.x = (event.clientX / sizes.width) - .5
    cursor.y = (event.clientY / sizes.height) - .5
})

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Guitars rotation
    guitarsGroup.rotation.y = elapsedTime * 0.1

    // Animate camera
    camera.position.y = (-scrollY / sizes.height) * (objectsDistance / 5)

    const parallaxX = cursor.x * 0.1
    const parallaxY = - cursor.y * 0.1
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * .8 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * .8 * deltaTime

    

    // Animate meshes
    /* for(const mesh of sectionMeshes) {
        mesh.rotation.x += deltaTime * 0.1
        mesh.rotation.y += deltaTime * 0.12
    } */

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()