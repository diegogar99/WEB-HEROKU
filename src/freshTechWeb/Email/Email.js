import React, {useState} from 'react';
import emailjs from 'emailjs-com';


const Email = (props) => {

   const frmContact = { userEmail:'', emailTitle:'', emailDetails:'' };
   const [contact,setContact] = useState(frmContact);
   const [showMessage, setShowMessage] = useState(false);
   const handleChange = e => { 
		const {name,value} = e.target;
		setContact({...contact,[name]:value}); 
		
   };
   const handleSubmit = e =>{
	    e.preventDefault();
	   console.log(contact.userEmail);
		emailjs.send('service_7rxj0y9','template_8mjw7qg', contact, 'user_wAL9M7ycdftxE5fepZep7')
		.then((response) => {
				   console.log('SUCCESS!', response.status, response.text);
				   setContact(frmContact);
				   setShowMessage(true);
		}, (err) => {
				   console.log('FAILED...', err);
		});
   }
  return (
    <div className="container pt-2 text-center">
		
		
		{ showMessage ? <div className="alert alert-success col-md-5 mx-auto" role="alert">Email enviado correctamente!!</div> : ``}
	
		<form className="fondoEmail"onSubmit={handleSubmit}>
			<br></br>
			  <div className="pt-3 col-md-5 mx-auto">
					<div className="form-group text-left"> <b>Email</b> <br/>
						<input required type="text" value={contact.userEmail} name="userEmail" onChange={handleChange} className="form-control" placeholder="Su email" />
					</div>
			  </div>
			
			  <div className="pt-3 col-md-5 mx-auto">
					<div className="form-group text-left"> <b>Título</b> <br/>
						<input value={contact.emailTitle} required type="text" name="emailTitle" onChange={handleChange}  className="form-control" placeholder="Escriba un título" />
					</div>
			  </div>
			  <div className="pt-3 col-md-5 mx-auto">
					<div className="form-group text-left"> <b>Descripción</b> <br/>
						<textarea required name="emailDetails" onChange={handleChange} className="form-control" placeholder="¿Qué desea?" value={contact.emailDetails}></textarea>
					</div>
			  </div>
			  {!props.tipo ?
			  	<pre><div className="pt-3 col-md-5 mx-auto text-left">
					  <button className="btn btn-primary">Enviar</button>
            <label>  </label>
            <button className="btn btn-primary" onClick={props.close}>Salir</button>        
			  	</div></pre>
          :
          <div className="pt-3 col-md-5 mx-auto text-center">
					  <button className="btn btn-primary">Enviar</button>
          </div>
				}
		</form>
			
	</div>
  );
}
export default Email;