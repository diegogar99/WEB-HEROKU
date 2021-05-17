import React from 'react'
import logo from '../../imagenes/logo.jpg'
import {Link} from  'react-router-dom'
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

import 'materialize-css/dist/css/materialize.min.css'




const contact = { emailDestination:'', code:''};

class Cabecera extends React.Component {
    constructor (props) {
        super(props)
        
    }
    

    
  
    render () {
    
        return (
          <>

          <div>
            <Toolbar className="Toolbar">

              <Link to="/"><img className="logoEmpresa" src={logo} alt="Logo"/></Link>
              <Link to="/"><Button>Volver al inicio</Button></Link>
            </Toolbar>
          </div>
          </>
        )
    }

}

export default Cabecera




