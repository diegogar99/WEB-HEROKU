import React from 'react'
import add from '../../../imagenes/add_icon.png'
import imagenes from '../../../imagenes/imagenes.jpg'
import cajaFuerte from '../../../imagenes/cajaFuerte.png'
import Popup from '../../PopUp/Popup.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import ArrayList from '../../Desplegable/ArrayList.js'
import ArrayListJerarquia from '../../Desplegable/ArrayListJerarquia.js'
import axios from 'axios';
import 'materialize-css/dist/css/materialize.min.css'


///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
//FUNCIONES AUXILIARES PARA GESTIONAR FECHAS Y ERRORES

function fecha(){
  var actual= new Date();

  var dia = actual.getDate();
  var anyo = actual.getFullYear();
  var mes = actual.getMonth() + 1;
  var resDia = dia.toString();
  var resMes = mes.toString();
  var resAnyo = anyo.toString();

  if (dia < 10){
    resDia = "0"+resDia;
  }
  if (mes < 10){
    resMes = "0"+resMes;
  }

  return resDia+"-"+resMes+"-"+resAnyo;
}

function verificarFecha(fechaVerif){

  var valida = false;
  var anyo = Number(fechaVerif[6] + fechaVerif[7] + fechaVerif[8] + fechaVerif[9]);
  var dia = Number(fechaVerif[0] + fechaVerif[1]);
  var mes = Number(fechaVerif[3] +  fechaVerif[4]);
  
  if(dia == 30 || dia == 31 || mes == 2){

    if (mes == 1 || mes == 3 || mes == 5 || mes == 7 || mes == 8 || mes == 10 || mes == 12){
      if(dia == 31){
        valida = true;
      }
    }else if (mes == 2){
      if ((anyo % 4 == 0 && anyo % 100 != 0)||(anyo % 400 == 0)){
        if(dia == 29){
          valida = true;
        }
      }else{
        if(dia == 28){
          valida = true;
        }
      }
    }else if(mes == 4 || mes == 6 || mes == 9){
      if(dia == 30){
        valida = true;
      }
    }
  }else{
    valida = true;
  }
  return valida;
}

const validate = values =>{
  const errors = {}

  if (!values.nombreImg){
    errors.nombreImg = 'Introduzca nombre válido'
  }
  if (!values.expiracionImg || !/[0-9][0-9]\-[0-9][0-9]\-[0-9][0-9][0-9][0-9]/.test(values.expiracionImg)||!compararFechas(values.creacionImg,values.expiracionImg) || !verificarFecha(values.expiracionImg)){
    errors.expiracionImg = 'Introduzca fecha válida'
  }
  if(!values.imgCreate){
    errors.imgCreate="Selecciona una imagen";
  }
  return errors
}
const validateEdit = values =>{
  const errors = {}

  if (!values.nombreImg){
    errors.nombreImg = 'Introduzca nombre válido'
  }
  if (!values.expiracionImg || !/[0-9][0-9]\-[0-9][0-9]\-[0-9][0-9][0-9][0-9]/.test(values.expiracionImg)||!compararFechas(values.creacionImg,values.expiracionImg) || !verificarFecha(values.expiracionImg)){
    errors.expiracionImg = 'Introduzca fecha válida'
  }
 
  return errors
}
function compararFechas(fecha1,fecha2){

  var fechaAct = Number(fecha1.split("-").reverse().join("-").replace(/-/g,""));
  var fechaCad = Number(fecha2.split("-").reverse().join("-").replace(/-/g,""));
  
  return fechaAct < fechaCad;

}

//Busca elemento en lista y devuelve indice o -1 si no está
function buscar(lista,elemento){
  var i;
  for(i=0; i< lista.length; i++){
    if(lista[i] == elemento){
      return i;
    }
  }
  return -1;
}

//Permuta dos elementos de una lista
function permuta(indice1, indice2, lista){
  var elemento = lista[indice1];
  lista[indice1] = lista[indice2];
  lista[indice2] = elemento;
  return lista;
}

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

//CLASE CUERPODOIMAGENES
class CuerpoImagenes extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      
      showPopup:false,
      showPopup2:false,
      showPopup5:false,
      nombreImg:'',
      errors: {},
      creacionImg:fecha(),
      expiracionImg:'',
      cargaContenido:true,
      token: localStorage.getItem('token'),
      listadoCategorias:[],
      categoria:localStorage.getItem('categoria'),
      vacio:true,
      ordenarPor:localStorage.getItem('ordenarPor'),
      ordenarDe:localStorage.getItem('ordenarDe'),
      cargando:true,
      listadoImagenes:[],
      nombreAnterior:'',
      imgShow: '',
      imgUrl:'',
      imgCreate:'',
      existe:false,

     
    }
    this.imgEdit={
      nombre:'',
      url:'',
      caducidad:'',
      activacion:'',
      categoria:'',

    }
    this.copiaLista={listaCopia:[]};  
    this.numero = 0;
    this.subirImagen=this.subirImagen.bind(this);
    this.subirImagenEdit=this.subirImagenEdit.bind(this);
    this.data = new FormData();
    this.dataImgEdit = new FormData();
    this.miListaV={
      listaV:["Nombre","Fecha de creación", "Fecha de caducidad", "Categoria"]
    }
  }

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
//AXIOS CONEXION CON API


//SELECT CATEGORIAS
  selectCategorias=async(value)=>{
    console.log("ENTRAAA2");
    const config = {
      headers: {'Authorization':`Bearer ${value}`},
    }
    await axios.get('https://fresh-techh.herokuapp.com/getcat',config
    )
    .then(response =>{
      console.log(response.data);
      var categoriasList = response.data;
      
      if(categoriasList.length >0){
        categoriasList[categoriasList.length] = {nombrecat:"Sin categoría"};
      }
      
      this.setState({listadoCategorias:categoriasList,cargaContenido:false});
   
    })
  }

//CREO NUEVO IMAGEN

  sendImg=async(value1,value2)=>{
    
    const headers = {'Authorization':`Bearer ${value1}`};
    await axios.post('https://fresh-techh.herokuapp.com/addPic',value2,{headers}
    )
    .then(response =>{
      console.log("RESP:", response.data);
      if(response.data.message == "ok"){
        this.setState({cargaContenido:true},() => this.togglePopup());
        localStorage.removeItem('categoria');
      }else{
        this.setState({existe:true,imgCreate:''});
        console.log("error");
      }
     
    })
    .catch(error=>{
      this.setState({existe:true});
      console.log(error.response);
    })
  }

//ELIMINO IMAGEN EXISTENTE

  eliminarImg=async(value1,value2)=>{
    console.log("ENTRAAA4");
    await axios.delete('https://fresh-techh.herokuapp.com/deletePic',
    
    {headers: {'Authorization':`Bearer ${value1}`}, data:{nombre:`${value2}`}},
  )
  
    .then(response =>{
      console.log(response.data);
      this.setState({cargaContenido:true});
    })
   
    .catch(error=>{
      console.log(error.response.data);
     
    })
    .catch(error=>{
      console.log(error.response.data);
     
    })
  }

  //SELECCIONO IMAGENES PARA MOSTRARLAS

  selectImagenes=async(value)=>{
    var lista = [];
    var indice = 0;
    var orden = '';
    var ordenarde ='';
    console.log("Ordenar por I: ",this.state.ordenarPor);
    if(this.state.ordenarPor == "Nombre"){
      orden = "nombre";
    }else if(this.state.ordenarPor == "Categoria"){
        orden = "categoria";
    }else if(this.state.ordenarPor == "Fecha de creación"){
      orden = "fechacreacion";
    }else if(this.state.ordenarPor == "undefined"){
      orden = "nombre";
    }else if(this.state.ordenarPor == null || this.state.ordenarPor == "null"){
      orden = "nombre";

    }else{
      orden = "fechacaducidad";
    }
    if(this.state.ordenarDe == null){
      ordenarde = "ASC";
    }else{
      ordenarde = this.state.ordenarDe;
    }
    console.log("Ordenar por img: ",orden);
    console.log("Ordenar de img: ",ordenarde);
    const config = {
      headers: {'Authorization':`Bearer ${value}`},
      params:{ordenarPor:orden,ordenarDe:ordenarde}
    }
    await axios.get('https://fresh-techh.herokuapp.com/getPicWeb',config
    )
    .then(response =>{
      console.log("RespuestaSelect: ", response.data);
      
      
      for(var i=0; i < response.data.length;i++){
         lista[indice] = response.data[i];
         indice = indice + 1;
      }

      if(lista.length == 0){
        console.log("Vacio: ",lista);
        this.setState({vacio:true});
      }else{
        this.setState({vacio:false});
      }
      
        this.setState({listadoImagenes:lista,cargaContenido:false,cargando:false});
    })
  }

  //GET PIC PARA VISUALIZAR IMAGEN
  showImgs=async(value1,value2)=>{

    await axios.get('https://fresh-techh.herokuapp.com/getPic',{params:{nombre:`${value1}`},headers:{'Authorization':`Bearer ${value2}`}}
    )
    .then(response =>{
      console.log("IMAGEN NOMBRE: ", response.data);
      if(this.numero == this.state.listadoImagenes.length){
        this.setState({cargaContenido:false});
      }
    })
    .catch(error=>{
      
      console.log("error");
    })
  }

  //GET PIC PARA VISUALIZAR IMAGEN2

  selectImgDetails=async(value1,value2)=>{

    await axios.get('https://fresh-techh.herokuapp.com/getPic',{params:{nombre:`${value1}`},headers:{'Authorization':`Bearer ${value2}`}}
    )
    .then(response =>{

      console.log("IMAGEN NOMBRE: ", response.data);
      this.imgEdit.activacion=response.data.fechacreacion;
      this.imgEdit.caducidad=response.data.fechacaducidad;
      this.imgEdit.url=response.data.nombreImagen;
      this.imgEdit.categoria=response.data.categoria;
      this.imgEdit.nombre=value1;
      
      if(response.data.categoria == null){
        this.imgEdit.categoria="Sin categoría"
      }else{
        this.imgEdit.categoria=response.data.categoria;
      }
      
      let array = this.state.listadoCategorias;
      if(array.length > 0){
        this.copiaLista.listaCopia = array.map((data) => data.nombrecat);
      }else{
        if(this.imgEdit.categoria == null){
          this.copiaLista.listaCopia[0] =  "Sin categoría";
        }else{
          this.copiaLista.listaCopia[0] =  this.imgEdit.categoria;
        }
      }
      if(this.copiaLista.listaCopia[0] == "sin categorias disponibles"){
        this.copiaLista.listaCopia[0] =  this.imgEdit.categoria;
      }else{

        var indiceElemento = buscar( this.copiaLista.listaCopia,this.imgEdit.categoria);
        if(indiceElemento == -1){
          this.copiaLista.listaCopia[this.copiaLista.listaCopia.length] = this.copiaLista.listaCopia[0];
          this.copiaLista.listaCopia[0] = this.imgEdit.categoria;
        }else{
          this.copiaLista.listaCopia = permuta(0, indiceElemento,this.copiaLista.listaCopia);
        }
      }
      
      this.togglePopup2();
      
     
    })
    .catch(error=>{
      
      console.log("error");
    })
  }

 //DESCARGAR IMAGEN
 descargar=async(value)=>{
  axios({
    url: value,
    method:"GET",
    responseType:"arraybuffer",
    headers: {
      'Content-Type': 'audio/mpeg'
    }
  })
  .then(responseDownload =>{
    const url = window.URL.createObjectURL(new Blob([responseDownload.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download",value);
    document.body.appendChild(link);
    link.click();
  })
.catch(error=> {
  console.log(error.message);
})

}
//EDITAR IMAGEN NO SE USA

  actualizarImg=async(value1,value2)=>{
    console.log("Token: ", value2);
    console.log("NombreAnt: ", this.state.nombreAnterior);
    console.log("Nombre: ", this.state.nombreImg);
    console.log("Categoria: ", value1);
    console.log("Caducidad: ", this.state.expiracionImg);
    console.log("Creacion: ", this.state.creacionImg);
    
    const datos = {nuevoNombre:this.state.nombreImg, categoria:value1,fechacreacion:this.state.creacionImg,fechacaducidad:this.state.expiracionImg,nombreAntiguo:this.state.nombreAnterior,actualizaImagen:'no'};
    console.log("DATOS: ", datos);
    const headers = {'Authorization':`Bearer ${value2}`};
    await axios.post('https://fresh-techh.herokuapp.com/editPic',datos,{headers},
    )
    .then(response =>{
      console.log("ACTUALIZO: ", response.data);
      this.setState({cargaContenido:true},() => this.togglePopup2());
      
      
    })
    .catch(error=>{
      console.log(error.response);
    })
  }


//EDITAR IMAGEN 2

  actualizImg=async(value1,value2)=>{
    console.log("Token: ", value2);
    console.log("NombreAnt: ", this.state.nombreAnterior);
    console.log("Nombre: ", this.state.nombreImg);
    console.log("Categoria: ", value1);
    console.log("Caducidad: ", this.state.expiracionImg);
    console.log("Creacion: ", this.state.creacionImg);
    
    const datos = {nuevoNombre:this.state.nombreImg, categoria:value1,fechacreacion:this.state.creacionImg,fechacaducidad:this.state.expiracionImg,nombreAntiguo:this.state.nombreAnterior,actualizaImagen:'no'};
    console.log("DATOS: ", datos);
    const headers = {'Authorization':`Bearer ${value1}`};
    await axios.post('https://fresh-techh.herokuapp.com/editPic',value2,{headers},
    )
    .then(response =>{
      console.log("RESP:", response.data);
      if(response.data.message == "ok"){
        this.setState({cargaContenido:true},() => this.togglePopup2());
        localStorage.removeItem('categoria');
        window.location.reload();
      }else{
        this.setState({existe:true});
        console.log("error");
      }
      
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

  //EDITA IMAGEN
  actualizar(value){

    this.dataImgEdit.set('nuevoNombre', this.state.nombreImg);
    //this.dataImgEdit.set('categoria', value);
    if(value== null){
      
      if((this.copiaLista.listaCopia[0] != "Sin categoría") && (this.copiaLista.listaCopia[0] != "sin categorias disponibles")){
        this.dataImgEdit.set('categoria', this.copiaLista.listaCopia[0]);
      }
    }
    else if((value != "Sin categoría") && (value != "sin categorias disponibles")){
   
      this.dataImgEdit.set('categoria', value);
    }else{
      this.dataImgEdit.delete('categoria');
    }
    this.dataImgEdit.set('fechacreacion', this.state.creacionImg);
    this.dataImgEdit.set('fechacaducidad', this.state.expiracionImg);
    this.dataImgEdit.set('nombreAntiguo', this.state.nombreAnterior);

    this.actualizImg(this.state.token,this.dataImgEdit);

  }

//ELIMINA IMAGEN
  eliminar=e=>{
    console.log("ENTRAAA3");
    var img = e.currentTarget.id;
    this.eliminarImg(this.state.token,img);
  }
//SELECCIONA IMAGEN

  select =e =>{
    e.preventDefault();
    
    var img = e.currentTarget.id;
    this.selectImgDetails(img,this.state.token);
  }

  //DESCARGAR IMAGEN
  download =e =>{
    e.preventDefault();
    var nombre = e.currentTarget.id;
    this.descargar("https://fresh-techh.herokuapp.com/"+nombre+".jpg");
    
  }

//CREAR IMAGEN NUEVA
 
  enviarImg(e){
    
    console.log('nombre', this.state.nombreImg);
    console.log('fechacaducidad', this.state.expiracionImg);
    this.data.set('nombre', this.state.nombreImg);

    if(localStorage.getItem('categoria') == null){
      console.log("NO1");
      if((this.miListaC.listaC[0] != "Sin categoría") && (this.miListaC.listaC[0] != "sin categorias disponibles")){
        this.data.set('categoria', this.miListaC.listaC[0]);
       
      }
    }
    else if((localStorage.getItem('categoria') != "Sin categoría") && (localStorage.getItem('categoria') != "sin categorias disponibles")){
      console.log("NO2");
      this.data.set('categoria', localStorage.getItem('categoria'));
    }else{
      this.data.delete('categoria');
    }
   
    this.data.set('fechacreacion', this.state.creacionImg);
    this.data.set('fechacaducidad', this.state.expiracionImg);
    this.sendImg(this.state.token,this.data);

  }

  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
  //IMAGENES
  //SUBIR IMAGEN AL CREAR NUEVO

  subirImagen(e){
    let img = e.target.files[0];
    console.log("imagen: ",img);

    if (img) {
      this.setState({errors:{},imgCreate:img},() =>  this.data.set('image', img));
     

    }else{
      alert("Selecciona una imagen")
    }
  }

  //SUBIR IAMAGEN AL EDITAR 

  subirImagenEdit(e){
    let img = e.target.files[0];
    console.log("imagen: ",img);

    if (img) {

      this.dataImgEdit.set('image', img);
      this.dataImgEdit.set('actualizaImagen', 'si');
 
    }else{
      this.dataImgEdit.set('actualizaImagen', 'no');
      alert("Selecciona una imagen")
    }
  }
 
  
 ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
  //POPUPS

  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup,
      errors:{},
      existe:false,
    });
    let array = this.state.listadoCategorias;
    if(array.length > 0){
      this.miListaC.listaC = array.map((data) => data.nombrecat);
    }

  }
  togglePopup2() {
    this.setState({
      showPopup2: !this.state.showPopup2,
      errors:{},
      nombreAnterior:this.imgEdit.nombre,
      expiracionImg:this.imgEdit.caducidad,
      nombreImg:this.imgEdit.nombre,
      existe:false,
    });
   
    
    
  }
  togglePopup5() {
    this.setState({
      showPopup5: !this.state.showPopup5,
    });
    
  }

///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////

  //HANDLE CHANGE

  handleChange = ({target}) => {
    const{name,value} = target
    this.setState({[name]:value})
    this.setState({existe:false,errors:{}});

   
  }

  //FORMULARIOS SUBMIT

  handleSubmit =e => {
    e.preventDefault()
    const {errors, ...sinErrors} = this.state
    const result = validate(sinErrors)
    this.setState({errors:result})
  
    if(!Object.keys(result).length){ //Si tiene propiedades, hay error
      //Envio formulario
      console.log('Formulario válido')
      this.enviarImg();
    }else{

      console.log('Formulario inválido')
    }
  }
  handleSubmitEdit =e => {
     
    e.preventDefault()
    const {errors, ...sinErrors} = this.state
    const result = validateEdit(sinErrors)
    this.setState({errors:result})
  
    if(!Object.keys(result).length){ //Si tiene propiedades, hay error
      //Envio formulario
      var cat = localStorage.getItem('categoria');
      this.actualizar(cat);
    }else{

      console.log('Formulario inválido')
    }
    
  }

 ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////

  //LISTA CATEGORIAS

  miListaC={
    listaC:["sin categorias disponibles"]
   }
  render () {
    const { errors,token,cargaContenido} = this.state
    {cargaContenido && this.selectImagenes(token)}
    {cargaContenido && this.selectCategorias(token)}

    return (
        <>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
       
        {/*<div className="filtro2">
          <ArrayListJerarquia />
        </div>*/}
        <div className="Filtro">
        <br></br><br></br>
        <div className="bloqueArray">
          {/*<div className="filtro3">
          <ArrayListJerarquia />
          </div>*/}
          <div className="filtro">
            <ArrayList tipo={false} valores={this.miListaV.listaV} contenido={"imagenes"}/>
          </div>
        </div>
      </div>
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
            <h4 className="header2">Imagenes</h4>
            <button className="anyade" onClick={this.togglePopup.bind(this)}>Añade una!</button>
           
          </div>
          </li>
        {this.state.vacio ? 
         <li class="collection-item avatar"><h5>No hay imagenes creadas</h5></li>
        :
        <>
        {this.state.listadoImagenes.map(data=>(
          <li key={data.nombre} className="collection-item avatar">
            
            
            <div className="contenidoList">
              <img className="cajaImg" src={ "https://fresh-techh.herokuapp.com/"+data.nombre+".jpg"} alt="cajaFuerte" />
              <pre><label>       </label></pre>
              <div className="contenedorNombreImg">
                <p id={data.nombre} className="nombreItemImg">{data.nombre}</p>
              </div>
              <p className="fechasImg">Fecha creación: {data.fechacreacion}<br></br>
                  Fecha caducidad: {data.fechacaducidad}
              </p>
              <div className="botonesEditDelImg">
                <input className="btn btn-primary" name={data.nombre} id={data.nombre} type='button' value='Editar'  onClick={this.select}/>
                <input className="btn btn-primary ml-2" name={data.nombre} id={data.nombre} type='button' value='Eliminar' onClick={this.eliminar}/>
                <input className="btn btn-primary ml-2" name={data.nombre} id={data.nombre} type='button' value='Descargar' onClick={this.download}/>
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
            text='Añade una imagen!'
            cuerpo={
              <>
               <form onSubmit={this.handleSubmit}>
                <span className="par">
                  <input classname="form-control" type="file" name="image" accept="image/jpeg" onChange={this.subirImagen}/>
                  
                  <pre>      </pre>
                  <ArrayList tipo={true} valores={this.miListaC.listaC}/>
                 
                  </span>
                <div className="pup">
                <div className="input-field">
                  <i className="material-icons prefix">assignment</i>
                  <input type="text" name="nombreImg"id="nombreImg" onChange={this.handleChange} placeholder="Nombre"/>
                  {errors.nombreImg && <p className="warning">{errors.nombreImg}</p>}
                  {this.state.existe && <p className="warning">Este nombre ya existe</p>}

                </div>
             
                <div className="input-field">
                  <i className="material-icons prefix">event_available</i>
                  <input className="fechaActual" type="date" name="creacionImg"id="creacionImg" value={"Fecha de creacion: " +this.state.creacionImg} readonly="readonly"/>
                  {errors.creacionImg && <p className="warning">{errors.creacionImg}</p>}
                </div>

                <div className="input-field">
                  <i className="material-icons prefix">event_busy</i>
                  <input type="date" name="expiracionImg"id="expiracionImg" placeholder={"Fecha de caducidad: DD-MM-YYYY"} onChange={this.handleChange}/>
                  {errors.expiracionImg && <p className="warning">{errors.expiracionImg}</p>}
                  {errors.imgCreate && <p className="warning">{errors.imgCreate}</p>}

                </div>   
           
               
                <br/>
                <input type='submit' className="btn waves-effect botonesLogin1 waves-light" value='Subir'/>
                <input type='button' className="btn waves-effect botonesLogin2 waves-light" value='Cerrar' onClick={this.togglePopup.bind(this)}/>
              </div>
              </form>
              </>
            }
            //sendData={<button type="Submit" className="Send" onClick={() => this.postData()}>Send</button>}
            eliminada={false}
          />
          : null
        }



        {this.state.showPopup2 ? 
              <Popup
                text='Edita la imagen'
                cuerpo={
                  <>
                <form onSubmit={this.handleSubmitEdit}>
                  <span className="par">
                   <input classname="form-control" type="file" name="image" accept="image/jpeg" onChange={this.subirImagenEdit}/>
                  
                    <pre>      </pre>
                    <ArrayList tipo={true} valores={this.copiaLista.listaCopia}/>
                 
                  </span>
                  <div className="pup">
                  <div className="input-field">
                    <i className="material-icons prefix">assignment</i>
                    <input type="text" name="nombreImg"id="nombreImg" onChange={this.handleChange} placeholder="Nombre" defaultValue={this.imgEdit.nombre}/>
                    {errors.nombreImg && <p className="warning">{errors.nombreImg}</p>}
                    {this.state.existe && <p className="warning">Este nombre ya existe</p>}

                  </div>
             
                  <div className="input-field">
                    <i className="material-icons prefix">event_available</i>
                    <input className="fechaActual" type="date" name="creacionImg"id="creacionImg" value={"Fecha de creacion: " +this.state.creacionImg} onChange={this.handleChange} readonly="readonly"/>
                    {errors.creacionImg && <p className="warning">{errors.creacionImg}</p>}
                  </div>

                  <div className="input-field">
                    <i className="material-icons prefix">event_busy</i>
                    <input type="date" name="expiracionImg"id="expiracionImg" placeholder={"Fecha de caducidad: DD-MM-YYYY"} onChange={this.handleChange} defaultValue={this.imgEdit.caducidad}/>
                    {errors.expiracionImg && <p className="warning">{errors.expiracionImg}</p>}
                  </div>
                <br/>
          
                <input type='submit' className="btn waves-effect waves-light botonesLogin1" value='Actualizar'/>
                <input type='button' className="btn waves-effect waves-light botonesLogin2" value='Cerrar' onClick={this.togglePopup2.bind(this)}/>
              </div>
              </form>
              </>
                }
              />
              :null
        }

     
      </>
    )
  }
}

export default CuerpoImagenes

