import React from 'react'
import Lista from '../../listaAvisos/Lista.js'
import axios from 'axios';

function compararFechas(fecha1,fecha2){

  var fechaAct = Number(fecha1.split("-").reverse().join("-").replace(/-/g,""));
  var fechaCad = Number(fecha2.split("-").reverse().join("-").replace(/-/g,""));
  
  return fechaAct < fechaCad;

}
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

class Cuerpo2 extends React.Component {

  constructor(props){
    super(props)
    this.state={
      cargaContenido:true,
      vacio:false,
      token: localStorage.getItem('token'),
      fechaActual:fecha(),
    }
    this.listaCaducados=[];
  }

  selectContrasenyaCaducadas=async(value)=>{
    var indice = 0;
    const config = {
      headers: {'Authorization':`Bearer ${value}`},
      params:{ordenarPor:"fechacaducidad",ordenarDe:"ASC"}
    }
    await axios.get('https://fresh-techh.herokuapp.com/passwdUser',config
    )
    .then(response =>{
      console.log("RespuestaSelect: ", response.data);
      if(response.data.length == 0){
        this.setState({vacio:true});
      }else{
        this.setState({vacio:false});
        for(var i=0; i < response.data.length;i++){
          if(!compararFechas(this.state.fechaActual,response.data[i].fechacaducidad)){
            this.listaCaducados[indice] = response.data[i];
            indice = indice + 1;
          }
        }
        console.log("LISTA: ", this.listaCaducados);
      }  
      this.setState({cargaContenido:false});
    })
  
  }

  render () {
    //const { gallery} = this.state
    {this.state.cargaContenido && this.selectContrasenyaCaducadas(this.state.token)}
    return (
      <>
        <Lista caducados={this.listaCaducados}/>
      </>
    )
  }
}

export default Cuerpo2
