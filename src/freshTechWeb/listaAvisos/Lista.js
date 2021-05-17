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
        if(this.listaCaducados.length == 0){
          this.vacio = true;
        }
        return (
          <>
          
          <br></br>
           <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
           
           <ul className="collection with-header">
            <li class="collection-heade ml-4r"><h4><strong>Contraseñas caducadas</strong></h4></li>
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
                  <span class="title">{data.nombre}</span>
                  <p>{data.fechacreacion}<br></br>
                  {data.fechacaducidad}
                  </p>

                </div>
                </li>
              ))}


              </>
            }
         

            {/*<li class="collection-item avatar">
              <div>
                <i class="material-icons circle red">picture_as_pdf</i>
                  <span class="title">Title</span>
                  <p>First Line <br></br>
                    Second Line
                  </p>
                <a href="#!" class="secondary-content"><i class="material-icons">send</i></a>
              </div>
            </li>
            <li class="collection-item avatar">
            <div>
                <i class="material-icons circle blue">lock_open</i>
                <span class="title">Title</span>
                <p>First Line <br></br>
                  Second Line
                </p>
                <a href="#!" class="secondary-content"><i class="material-icons">send</i></a>
              </div>
            </li>
            <li class="collection-item avatar">
            <div>
                <i class="material-icons circle green">image</i>
                <span class="title">Title</span>
                <p>First Line <br></br>
                  Second Line
                </p>
                <a href="#!" class="secondary-content"><i class="material-icons">send</i></a>
              </div>
              </li>*/}

           
          </ul>

    
         </>
        )
      }

}

export default Lista



