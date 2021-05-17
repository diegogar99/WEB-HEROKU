import React from 'react'
import PropTypes from 'prop-types'

function seleccionada(valor){

}

class ArrayList extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
     asc:true,
     desc:false,
     tipo:this.props.tipo,
     checked:localStorage.getItem('ordenarDe'),
     contenido:this.props.contenido,
     valor:localStorage.getItem('ordenarPor'),
    };
    this.marcado = true;
    this.ordenarPorDefecto="Nombre";
}

handleChange= ({target}) => {

  if(target.value != "sin categorias disponibles"){
    localStorage.setItem('categoria', target.value);
 
  }else{
    localStorage.setItem('categoria', null);

  }
  
}

handleChange1 = ({target}) => {
  console.log("AQUI1");
  this.setState({asc:true,desc:false});
  localStorage.setItem('ordenarDe', "ASC");

}
handleChange2 = ({target}) => {
  console.log("AQUI2");
  this.setState({desc:true,asc:false});
  localStorage.setItem('ordenarDe', "DSC");

}
handleChange3 = ({target}) => {
  console.log("AQUI3");
  this.setState({valor:target.value},() => localStorage.setItem('ordenarPor', this.state.valor));
  
}
handleSubmit =e => {
  
  if (!this.state.tipo){
    console.log("ORDENARPOR");
    localStorage.setItem('ordenarPor', this.state.valor);
    
  }else{
    if(this.state.valor != "sin categorias disponibles"){
      localStorage.setItem('categoria', this.state.valor);
      
    }else{
      localStorage.setItem('categoria', null);
     
    }
    
  }
  
}

  render()
  {
   
    if(this.state.checked == "ASC"){
      this.marcado = true;
    }else if (this.state.checked == "DSC"){
      this.marcado = false;
    
    }else{
      this.marcado = true;
    }
  
    return(
     
      <form onSubmit={this.handleSubmit}>
        <pre><div className="array">
          <select className = "browser-default browser" defaultValue={localStorage.getItem('ordenarPor')} onChange={!this.state.tipo ? this.handleChange3:this.handleChange}>
  
            {this.props.valores.map(data=>(
              <option value={data} key={data}>{data}</option>
            ))}
          </select>
        
          {!this.state.tipo ?
            <>
              <pre>    </pre>
              <div>
                <label>
                  <input className="with-gap" id="input1" name="radio" type="radio"  defaultChecked={this.marcado ? true:false} onChange={this.handleChange1}/>
                  <span className="checkFont">Ascendente</span> 
                </label>
                <br></br>
              <label>
                <input className="with-gap" id="input2" name="radio" type="radio" defaultChecked={!this.marcado ? true:false} onChange={this.handleChange2}/>
                <span className="checkFont">Descendente</span>
              </label>
              </div>
              <label>   </label>
              <input className="btn btn-primary" type="submit" value="Send"/>
            </>
            :null
          }
          
          
        </div></pre>
        
      </form>
    );
  }
}
ArrayList.propTypes = {
  
  tipo:PropTypes.bool.isRequired,
  valores:PropTypes.array.isRequired,
  
}
export default ArrayList