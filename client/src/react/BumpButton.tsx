import './BumpButton.scss'
import React, { Component } from 'react'

interface Props {
  color?: string,
  disabled?: boolean,
  handleClick: ()=>void
}

interface State {
}

export class BumpButton extends Component<Props, State> {
  render () {
    const { color, disabled } = this.props
    return (
      <button disabled={disabled} onClick={this.props.handleClick} className='bump-button'>
        <div className={`round ${color || 'green'}`}>
          <span>{this.props.children}</span>
        </div>
      </button>
    )
  }
}
