import React from 'react'
import 'materialize-css/dist/css/materialize.min.css'
import PropTypes from 'prop-types'

class Lista extends React.Component {
    constructor(props){
        super(props)
        this.listaCaducados = this.props.caducados;
        this.vacio=false;
    }
    render () {
        console.log("PILLA: ",this.listaCaducados);
        console.log("MANDAMOS: ",this.props.caducados);
        if(this.listaCaducados.length == 0){
          console.log("NO DEBERIA");
          this.vacio = true;
        }else{
          this.vacio = false;
        }
        console.log("VACIO: ",this.vacio );
        return (
          <>
          
          <br></br><br></br><br></br>
           <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
           
           <ul className="collection header with-header">
            <li class="collection-header header ml-4r"><h4><strong>Contraseñas caducadas</strong></h4></li>
            {this.vacio ?
              <li class="collection-header"><h6>No se ha detectado ninguna fecha expirada</h6></li>
              :
              <>
              {this.listaCaducados.map(data=>(
                <li key={data}class="collection-item avatar">
                <div>
                  {data.tipo == "usuario-passwd" ?
                
                    <i class="material-icons circle green">lock_open</i>
                  :
                  <>
                  {data.tipo == "imagen" ?
                    <i class="material-icons circle green">lock_open</i>
                  :
                  <>
                    {data.tipo == "file" ?
                      <i class="material-icons circle green">picture_as_pdf</i>
                    :null
                    }
                    </>
                  }
                  </>

                }
                <div className="contenidoList">
                  <div className="contenedorNombreUserPasswd">
                    <p id={data.nombre} className="nombreItem">{data.nombre}</p>
                  </div>
                  <p className="fechas">Fecha creación: {data.fechacreacion}<br></br>
                    Fecha caducidad: {data.fechacaducidad}
                  </p>
                </div>
                

                </div>
                </li>
              ))}


              </>
            }
          
          </ul>

    
         </>
        )
      }

}

export default Lista



