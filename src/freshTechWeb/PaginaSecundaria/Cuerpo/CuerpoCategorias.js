import React from 'react'
import vacia from '../../../imagenes/emptyfolder.png'
import add from '../../../imagenes/add_icon.png'
import ArrayListJerarquia from '../../Desplegable/ArrayListJerarquia.js'
import categorias from '../../../imagenes/categorias.png'
import Popup from '../../PopUp/Popup.js'
import axios from 'axios';
import 'materialize-css/dist/css/materialize.min.css'


///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
//FUNCIONES AUXILIARES PARA GESTIONAR ERRORES
const validate = values =>{
  const errors = {}

  if (!values.categoria){
    errors.categoria = 'Introduzca una categoría valida'
  } 
  
  return errors
}

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

//CLASE CUERPOCATEGORIAS
class CuerpoCategorias extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      categoria:'',
      showPopup:false,
      showPopup2:false,
      errors: {},
      token: localStorage.getItem('token'),
      cargaContenido:true,
      listadoCategorias:[],
      vacio:true,
      cargando:true,
      existe:false,

   
    }
  
    this.catEdit={nombre:''};
    
  }

  ///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
//AXIOS CONEXION CON API

//ENVIA LA NUEVA CATEGORIA CREADA
  crearCategoria=async(value)=>{
    console.log("ENTRA CAT: ",value);
    const body = {nombrecategoria:this.state.categoria};
    const headers = {'Authorization':`Bearer ${value}`};
    await axios.post('https://fresh-techh.herokuapp.com/addcat',body,{headers}
    )
    .then(response =>{
      console.log(response.data);
      this.setState({cargaContenido:true});
      this.togglePopup();

    })
    .catch(error=>{
      this.setState({existe:true});
      console.log(error.response);
    })
  }

  //SELECCIONA CATEGORIAS EXISTENTES
  selectCategorias=async(value)=>{
    console.log("ENTRAAA");

    const config = {
      
      headers: {'Authorization':`Bearer ${value}`},
    }
    await axios.get('https://fresh-techh.herokuapp.com/getcat',config
    )
    .then(response =>{
      console.log("esto: ", response.data.length);
      if(response.data.length == 0){
        this.setState({vacio:true});
      }else{
        this.setState({vacio:false});
      }
      this.setState({listadoCategorias:response.data,cargaContenido:false,cargando:false});
    })
  
  }
//ELIMINA CATEGORIA SELECCIONADA
  deleteCategorias=async(value1,value2)=>{
    console.log("ENTRAAA: ", value1, " -- ", value2);
  
    await axios.delete('https://fresh-techh.herokuapp.com/deletecat',{headers:{'Authorization':`Bearer ${value2}`},data:{nombrecategoria:`${value1}`}}
    )
    .then(response =>{
      console.log(response.data);
      this.setState({cargaContenido:true});
    })
    .catch(error=>{
      console.log(error.response.data);
     
    })
  }
  //ACTUALIZA NOMBRE DE UNA CATEGORÍA SELECCIONADA
  editarCategoria=async(value2)=>{
  
    const datos = {nomCatAntigua:this.catEdit.nombre,nomCatNueva:this.state.categoria};
    const headers = {'Authorization':`Bearer ${value2}`};
    await axios.post('https://fresh-techh.herokuapp.com/editCat',datos,{headers}
    )
    .then(response =>{
      console.log(response.data);
      this.setState({cargaContenido:true},() => this.togglePopup2());
      
      
    })
    .catch(error=>{
      this.setState({existe:true});
      console.log(error.response);
    })
  
  }
    ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////

  //FUNCIONES QUE USAN LAS AXIOS
  //ACTUALIZAR CATEGORIA
  editar=e=>{
    this.catEdit.nombre = e.currentTarget.id;
    this.togglePopup2();
  }
  //ELIMINAR CATEGORÍA
  delete =e =>{
    e.preventDefault();
    console.log("ELEGIDA: ", e.currentTarget.id);
    var cat = e.currentTarget.id;
    this.deleteCategorias(cat,this.state.token);
    
  }

   ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
  //POPUPS

  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup
    });
  }
  togglePopup2() {
    this.setState({
      showPopup2: !this.state.showPopup2
    });
  }


   ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////

  //HANDLE CHANGE
  handleChange = ({target}) => {
    const{name,value} = target
    this.setState({[name]:value})
    this.setState({existe:false});

   
  }
//FORMULARIOS SUBMIT
  handleSubmit =e => {
    e.preventDefault()
    console.log("?????");
    const {errors, ...sinErrors} = this.state
    const result = validate(sinErrors)
    this.setState({errors:result})
    
    if(!Object.keys(result).length){ //Si tiene propiedades, hay error
      //Envio formulario
      this.crearCategoria(this.state.token);
      
      console.log('Formulario válido')
    }else{

      console.log('Formulario inválido')
    }
  }
  handleSubmitEdit =e => {
    e.preventDefault()
    const {errors, ...sinErrors} = this.state
    const result = validate(sinErrors)
    this.setState({errors:result})
    
    if(!Object.keys(result).length){ //Si tiene propiedades, hay error
      //Envio formulario
      this.editarCategoria(this.state.token);
      
      console.log('Formulario válido')
    }else{

      console.log('Formulario inválido')
    }
  }

  render () {
    
    const { errors,token,cargaContenido} = this.state
    {cargaContenido && this.selectCategorias(token)}
    {console.log("carga: ", cargaContenido)}
    return (
      <>
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
      
      
     
      <br></br><br></br>     
      {this.state.cargando ?
     <div className="preloader">
      <div class="preloader-wrapper big active">
        <div class="spinner-layer spinner-blue-only">
          <div class="circle-clipper left">
            <div class="circle"></div>
          </div><div class="gap-patch">
            <div class="circle"></div>
          </div><div class="circle-clipper right">
            <div class="circle"></div>
          </div>
        </div>
      </div>
      </div>
    :
    <>
    

        <ul className="collection header col">
        <li className="collection-header header2 ml-4">
         <div className="contenidoList">
            <h4 className="header2">Categorías</h4>
            <button className="anyade" onClick={this.togglePopup.bind(this)}>Añade una!</button>
          </div>
        </li>
        {this.state.vacio ? 
         <li class="collection-item avatar"><h4>No hay categorías creadas</h4></li>
        :
        <>
        {this.state.listadoCategorias.map(data=>(
          <li key={data.nombrecat} class="collection-item avatar">
            <i class="material-icons circle blue">assignment</i>
            <div className="contenidoList">
              <div className="contenedorNombreCat">
               <p id={data.nombre} className="nombreItem">{data.nombrecat}</p>
              </div>
              <div className="botonDel">
                <input className="btn waves-effect waves-light mr-5" name={data.nombrecat} id={data.nombrecat} type='button' value='Editar'  onClick={this.editar}/>
                <input className="btn waves-effect waves-light" name={data.nombrecat} id={data.nombrecat} type='button' value='Eliminar' onClick={this.delete}/>
               
              </div>
            </div>
          </li>
        ))} 
        </>
  }
      </ul>
      </>
  
    }   


      {this.state.showPopup ? 
          <Popup
            text='Añade una categoria!'
            cuerpo={
              <>
              <form className="pup" onSubmit={this.handleSubmit}>
              
                   <div className="input-field">
                      <i className="material-icons prefix circle">assignment</i>
                      <input type="text" name="categoria"id="categoria" onChange={this.handleChange} placeholder={"Introduzca una categoría nueva"}/>
                      {errors.categoria && <p className="warning">{errors.categoria}</p>}
                      {this.state.existe && <p className="warning">Este nombre ya existe</p>}

                    </div>
                  

                <br/>
                <input type='submit' class="btn waves-effect waves-light mr-5" value='Añadir'/>
                <input type='button' class="btn waves-effect waves-light" value='Cancelar' onClick={this.togglePopup.bind(this)}/>
              </form>
               
      
              </>
            }
            eliminada={false}
          />
          : null
        }
        {this.state.showPopup2 ? 
          <Popup
            text='Actualiza la categoría:'
            cuerpo={
              <>
              <form className="pup" onSubmit={this.handleSubmitEdit}>
              
                   <div className="input-field">
                      <i className="material-icons prefix circle">assignment</i>
                      <input type="text" name="categoria"id="categoria" onChange={this.handleChange} placeholder={"Introduzca una categoria"} defaultValue={this.catEdit.nombre}/>
                      {errors.categoria && <p className="warning">{errors.categoria}</p>}
                      {this.state.existe && <p className="warning">Este nombre ya existe</p>}

                    </div>
                <br/>
                <input type='submit' class="btn waves-effect waves-light mr-5" value='Actualizar'/>
                <input type='button' class="btn waves-effect waves-light" value='Cancelar' onClick={this.togglePopup2.bind(this)}/>
              </form>
               
      
              </>
            }
            eliminada={false}
          />
          : null
        }

   </>
    )
  }
}

export default CuerpoCategorias

