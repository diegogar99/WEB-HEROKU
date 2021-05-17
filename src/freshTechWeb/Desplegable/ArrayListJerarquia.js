import React from 'react'






class ArrayListJerarquia extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      si:false,
      valores:["Elija un filtro primero..."],
     };
  }
  miLista ={
    listaVacia:["Elija un filtro primero..."],
    listaFA: ["FechaActivacion1","FechaActivacion2", "FechaActivacion3", "FechaActivacion4"],
    listaFC: ["FechaCaducidad1","FechaCaducidad2", "FechaCaducidad3", "FechaCaducidad4"],
    listaC:["Categoria1","Categoria 2", "Categoria 3", "Categoria 4"]
   }
  selectFiltro =(e) =>{
    let valor;
    let i = e.target.selectedIndex;
    let val = e.target.options[i].value;
    if (val == 0){
      valor = this.miLista.listaVacia;
    }else if(val == 1){
      valor = this.miLista.listaC;
    }else if(val == 2){
      valor = this.miLista.listaFA;
    }else{
      valor = this.miLista.listaFC;
    }
    
    this.setState({opcion:val,valores:valor,si:true});
    
    
  }

   
  opciones(){
    
    
    return <select className="browser-default browser">
    {this.state.valores.map(data=>(
      <option key={data}>{data}</option>
    ))}
  </select>
  }
   
  render()
  {

    return(
     
     <pre><div className="tablaFiltros">
        <table>
           <tbody>
          <tr>
            <td>
              <span className="textoFiltro">Filtro</span>  {   }    
            </td>
            <td>
              <select  className="browser-default browser" name="filtros" if="filtros" onChange={this.selectFiltro}>
                <option value="0">Sin filtro...</option>
                <option value="1">Categoria</option>
                <option value="2">Fecha de activacion</option>
                <option value="3">Fecha de caducidad</option>
              </select>
            </td>
          </tr>
         
          <tr>
            <td align="right">
              
            </td>
            <td>
            {this.opciones()}
            </td>
           
          </tr>
          </tbody>
        </table>
      </div></pre>

  
     
    );
  }
}

export default ArrayListJerarquia







