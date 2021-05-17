import React from 'react'
import logo from '../../../imagenes/logo.jpg'
import {Link} from  'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from  'reactstrap'
import Popup from '../../PopUp/Popup.js'
import Email from '../../Email/Email.js'
import 'materialize-css/dist/css/materialize.min.css'

class Cabecera2 extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
          open: false,
          showPopup:false,
          showPopup4:false,
        };
    }

    abrirCerrarDD = (e) => {
      this.setState({open: !this.state.open})
    }
    vaciarLocalMem=e=>{
     
      localStorage.removeItem('categoria');
      localStorage.removeItem('ordenarPor');
      localStorage.removeItem('ordenarDe');
    }
    /*
    togglePopup() {
      this.setState({
        showPopup: !this.state.showPopup
      });
    }
    togglePopup4() {
      this.setState({
        showPopup4: !this.state.showPopup4
      });
    
    }*/
  
  
    render () {
        return (
          <>
            <table className="cabecera">
              <tbody>
                <tr>
                  <td><Link to="/paginaSecundaria" onClick={this.vaciarLocalMem}>
                    <img className="logoEmpresa" src={logo} alt="Logo"/>
                  </Link></td>
                  <td>
                  <>
                    <Dropdown isOpen={this.state.open} toggle={this.abrirCerrarDD}>
                      <DropdownToggle className="drop">
                        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
                        <span className="desplegable"><i className="fa fa-navicon"></i></span>
                        </DropdownToggle>
                      <DropdownMenu className="menu">
                        <DropdownItem><Link to="/paginaSecundaria/administracion" className="opt" onClick={this.vaciarLocalMem}>Administrar Cuenta</Link></DropdownItem>
                        <DropdownItem><Link to="/paginaSecundaria/categorias" className="opt" onClick={this.vaciarLocalMem}>Administrar Categorías</Link></DropdownItem>
                        <DropdownItem><Link to="/paginaSecundaria/contacto" className="opt" onClick={this.vaciarLocalMem}>Contacta con nosotros</Link></DropdownItem>
                        {/*<DropdownItem><input type="button" className="opt" value = "Contacta con nosotros" onClick={this.togglePopup.bind(this)} /></DropdownItem>*/}
                      </DropdownMenu>
                    </Dropdown>
              




                    
                    </>
                  </td>
                  <td><Link to="/paginaSecundaria/seguridad" onClick={this.vaciarLocalMem}>
                    <button className="seguridad">Seguridad</button>
                  </Link></td>
                  <td><Link to="/paginaSecundaria/contraseñas" className="contrasenyaLink" onClick={this.vaciarLocalMem}>
                    <button className="contraseñas">Contraseñas</button>
                  </Link></td>
                  <td><Link to="/paginaSecundaria/documentos" onClick={this.vaciarLocalMem}>
                    <button className="documentos">Documentos</button>
                  </Link></td>
                  <td><Link to="/paginaSecundaria/imagenes" onClick={this.vaciarLocalMem}>
                    <button className="imagenes">Imagenes</button>
                  </Link></td>
                </tr>
              </tbody>
              
            </table>
            {/*{this.state.showPopup ? 
             <Popup
                text='Contacta con nosotros!'
                cuerpo={
                  <>
                    <h2>Pulse aquí:</h2>
                    <br></br>
                    <button className="btn btn-outline-success" onClick={this.togglePopup4.bind(this)}><strong>freshtech@gmail.com</strong></button>
                    <br></br><br></br>
                    <input type='button' className="btn btn-primary" value='Cerrar' onClick={this.togglePopup.bind(this)}/>
                  </>
                }
                eliminada={false}
              />
            :null
           }
             {this.state.showPopup4 ? 
              <Popup
                text='Contacta con nosotros'
                cuerpo = {
                  <>
                
                    <Email close={this.togglePopup4.bind(this)}/>
                  </>

                }
              />
            :null
            }*/}
          </>
        );
    }
}
export default Cabecera2


