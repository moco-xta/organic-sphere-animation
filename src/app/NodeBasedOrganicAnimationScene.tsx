'use client'

import React, { Component, createRef, RefObject } from 'react'

import NodeBasedOrganicAnimationClass from './NodeBasedOrganicAnimationClass.js'

interface NodeBasedOrganicAnimationSceneState {
  initialized: boolean
}

export default class NodeBasedOrganicAnimationScene extends Component<
  Record<string, never>,
  NodeBasedOrganicAnimationSceneState
> {
  private canvasRef: RefObject<HTMLDivElement | null>

  constructor(props: Record<string, never>) {
    super(props)
    this.canvasRef = createRef()
  }

  componentDidMount() {
    this.init()
  }

  init = () => {
    new NodeBasedOrganicAnimationClass({
      container: this.canvasRef.current,
    })
  }

  render() {
    return <div ref={this.canvasRef}></div>
  }
}
