import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
// import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js'

// import vertexShader from '../shaders/node_based_organic_animation/vertexShader.glsl'
import vertexPars from './shaders/vertex_pars.glsl'
import vertexMain from './shaders/vertex_main.glsl'
// import fragmentShader from '../shaders/node_based_organic_animation/fragmentShader.glsl'
import fragmentPars from './shaders/fragment_pars.glsl'
import fragmentMain from './shaders/fragment_main.glsl'

export default class NodeBasedOrganicAnimationClass {
  constructor(props) {
    const { container } = props

    this.isPlaying = true
    this.time = 0

    this.container = container

    this.scene = new THREE.Scene()

    this.width = window.innerWidth
    this.height = window.innerHeight

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(this.width, this.height)
    this.renderer.setClearColor(0xffffff, 1)

    this.raycaster = new THREE.Raycaster()
    this.pointer = new THREE.Vector2()

    this.container.appendChild(this.renderer.domElement)

    this.camera = new THREE.PerspectiveCamera(70, this.width / this.height, 0.01, 1000)
    this.camera.position.set(0, 0, 4)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    this.dirLight = new THREE.DirectionalLight('#526cff', 0.6)
    this.dirLight.position.set(2, 2, 2)
    this.ambientLight = new THREE.AmbientLight('#4255ff', 0.5)
    this.scene.add(this.dirLight, this.ambientLight)

    this.material = new THREE.MeshStandardMaterial({
      onBeforeCompile: (shader) => {
        this.material.userData.shader = shader

        shader.uniforms.uTime = { value: 0 }

        const parsVertexString = /* glsl */ `#include <displacementmap_pars_vertex>`
        shader.vertexShader = shader.vertexShader.replace(
          parsVertexString,
          parsVertexString + vertexPars,
        )

        const mainVertexString = /* glsl */ `#include <displacementmap_vertex>`
        shader.vertexShader = shader.vertexShader.replace(
          mainVertexString,
          mainVertexString + vertexMain,
        )

        const parsFragmentString = /* glsl */ `#include <bumpmap_pars_fragment>`
        shader.fragmentShader = shader.fragmentShader.replace(
          parsFragmentString,
          parsFragmentString + fragmentPars,
        )

        const mainFragmentString = /* glsl */ `#include <normal_fragment_maps>`
        shader.fragmentShader = shader.fragmentShader.replace(
          mainFragmentString,
          mainFragmentString + fragmentMain,
        )

        console.log(shader.fragmentShader)
      },
    })

    this.renderPass = new RenderPass(this.scene, this.camera)

    this.bloomPass = new UnrealBloomPass(new THREE.Vector2(this.width, this.height), 1.5, 0.4, 0.85)
    this.bloomPass.threshold = 0
    this.bloomPass.strength = 1
    this.bloomPass.radius = 0

    this.outputPass = new OutputPass()

    this.composer = new EffectComposer(this.renderer)
    this.composer.addPass(this.renderPass)
    this.composer.addPass(this.bloomPass)
    this.composer.addPass(this.outputPass)

    this.addObjects()
    this.render()

    this.setupResize()
  }

  addObjects() {
    const geometry = new THREE.IcosahedronGeometry(1, 300)
    this.material = new THREE.MeshStandardMaterial({
      onBeforeCompile: (shader) => {
        // storing a reference to the shader object
        this.material.userData.shader = shader

        // uniforms
        shader.uniforms.uTime = { value: 0 }

        const parsVertexString = /* glsl */ `#include <displacementmap_pars_vertex>`
        shader.vertexShader = shader.vertexShader.replace(
          parsVertexString,
          parsVertexString + vertexPars,
        )

        const mainVertexString = /* glsl */ `#include <displacementmap_vertex>`
        shader.vertexShader = shader.vertexShader.replace(
          mainVertexString,
          mainVertexString + vertexMain,
        )

        const mainFragmentString = /* glsl */ `#include <normal_fragment_maps>`
        const parsFragmentString = /* glsl */ `#include <bumpmap_pars_fragment>`
        shader.fragmentShader = shader.fragmentShader.replace(
          parsFragmentString,
          parsFragmentString + fragmentPars,
        )
        shader.fragmentShader = shader.fragmentShader.replace(
          mainFragmentString,
          mainFragmentString + fragmentMain,
        )
      },
    })

    const plane = new THREE.Mesh(geometry, this.material)
    this.scene.add(plane)
  }

  render() {
    if (!this.isPlaying) return
    this.time += 0.05
    if (this.material.userData.shader)
      this.material.userData.shader.uniforms.uTime.value = this.time / 50
    requestAnimationFrame(this.render.bind(this))
    this.renderer.render(this.scene, this.camera)
    /* this.composer.render() */
  }

  setupResize() {
    window.addEventListener('resize', this.resize.bind(this))
  }

  resize() {
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.renderer.setSize(this.width, this.height)
    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()
  }
}
