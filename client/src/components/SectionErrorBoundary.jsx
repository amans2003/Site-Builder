import { Component } from 'react'

export class SectionErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error(`Section "${this.props.sectionType}" failed to render:`, error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="p-4 text-sm text-red-500 bg-red-50 border border-red-200">
          This "{this.props.sectionType}" section couldn't be rendered. Try deleting and re-adding it.
        </div>
      )
    }
    return this.props.children
  }
}
