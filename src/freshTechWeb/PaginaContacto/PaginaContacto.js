import React from 'react'
import CabeceraContacto from './CabeceraContacto.js'
import CopyR from '../Footer/CopyR'
import CuerpoContactoInicio from './CuerpoContactoInicio.js'
class PaginaInicial extends React.Component {
    constructor (props) {
        super(props)
    }

    render () {
      return (
        <React.Fragment> 
          <CabeceraContacto/>
          <CuerpoContactoInicio />
          <CopyR>© 2021 Fresh Tech. Todos los derechos reservados. Marca comercial.</CopyR>
         </React.Fragment>

        )
    }
}
export default PaginaInicial