import * as THREE from 'three'

declare module 'three' {
  interface Material {
    userData: {
      shader?: THREE.Shader
    }
  }

  interface MeshStandardMaterialParameters {
    onBeforeCompile?: (shader: THREE.Shader) => void
  }
}
