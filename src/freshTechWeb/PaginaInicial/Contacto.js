import React from 'react'
import Cabecera from './Cabecera/Cabecera'
import Menu2 from './Cabecera/menuInicial'
import Cuerpo from './Cuerpo/Cuerpo'
import CopyR from '../Footer/CopyR'
import CuerpoContacto from './Cuerpo/CuerpoContacto.js'
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom'
class PaginaInicial extends React.Component {
    constructor (props) {
        super(props)
    }

    render () {
      return (
        <React.Fragment> 
          <Cabecera/>
         
          {/*<Cuerpo />*/}
          <Switch>
            <Route path="/" exact component={Cuerpo} />
            <Route path="/contacto" component={CuerpoContacto} />
          </Switch>
          <CopyR>© 2021 Fresh Tech. Todos los derechos reservados. Marca comercial.</CopyR>
         </React.Fragment>

        )
    }
}
export default PaginaInicial