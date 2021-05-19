import React from 'react'
import img1 from '../../../imagenes/img1.png'
import img2 from '../../../imagenes/img2.png'
import img3 from '../../../imagenes/img3.png'
import img5 from '../../../imagenes/password.png'
import img6 from '../../../imagenes/shield.png'
import img7 from '../../../imagenes/world.png'
import img8 from '../../../imagenes/docs.png'



class Info extends React.Component {

  constructor(props){
    super(props)
    this.state = {
     
      search: '',
      input:0,
      
    }
  }
  async componentDidMount (){
    this.setState({search:img1, isFectch : false})
  }
  handleChange1 = (e) => {
    this.setState({search: img1,input:0})
  }
  handleChange2 = (e) => {
    this.setState({search: img2,input:1})
  }
  handleChange3 = (e) => {
    this.setState({search: img3,input:2})
  }
  render () {
    const {search,input} = this.state
    return (
      <>
   
      <br></br>

      <div className="inicio">
        <img className="imagenLogos" src={img5} />   
        <h5>Genera contraseñas seguras</h5>
        <p className="parrafo1"> El generador de contraseñas integrado te permite crear largas contraseñas aleatorias</p>
      </div>
      
      <div className="inicio2">
        <img className="imagenLogos" src={img6} /> 
        <h5>Protégete contra hackeos</h5>
        <p className="parrafo1">Deja de preocuparte por los robos de datos y protégete contra los hackeos</p>
      </div>

      <div className="inicio3">
        <img className="imagenLogos" src={img8} /> 
        <h5>Almacena documentos importantes</h5>
        <p className="parrafo1">Manten tus imágenes y documentos a buen recaudo para que te resulte sencillo encontrarlos</p>
      </div>

      <div className="inicio4">
        <img className="imagenLogos" src={img7} /> 
        <h5>Accede desde donde quiera</h5>
        <p className="parrafo1">Accede a FreshTech desde cualquier lugar en tu navegador web de confianza o en tu dispositivo Android</p>
      </div>
      
      <div className="cuerpo1">
        <div className="anuncio">
          {input === 0 && 
            <p>La seguridad y privacidad que necesitas</p>
          }
          {input === 1 && 
            <p>Todas tus contraseñas disponibles en un solo click</p>
          }
          {input === 2 && 
            <p>Simple de usar y muy intuitiva</p>
          }
        </div>
      </div>
     </>
    )
  }
}

export default Info


