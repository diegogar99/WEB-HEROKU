import React from 'react'
import PaginaInicial from '../PaginaInicial/PaginaInicial.js'
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import PaginaSecundaria from '../PaginaSecundaria/PaginaSecundaria.js'
import PaginaContacto from '../PaginaContacto/PaginaContacto.js'

function Raiz() {
  return ( 
  <Router>
    <Switch>
      <Route path="/" exact component={PaginaInicial} />
      <Route path="/paginaSecundaria" component={PaginaSecundaria} />
      <Route path="/contacto" component={PaginaContacto} />
    </Switch>
  </Router>
    
  );
}



export default Raiz