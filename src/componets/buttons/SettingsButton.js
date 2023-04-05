import React from 'react'
import Button from './Button'
import { faGear } from '@fortawesome/free-solid-svg-icons'

export default function SettingsButton(props) {
  return (
    <Button icon={ faGear } iconSize={"2xl"} style={Object.assign({}, style, props.style)} onClick={() => window.location.href='/configuracion'}/>
  )
}

const style = {
    background: "#969696",
    width: 100,
    height: "100%",
}