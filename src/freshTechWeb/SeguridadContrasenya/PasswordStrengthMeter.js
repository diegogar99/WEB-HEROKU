import React, { Component } from 'react';
import zxcvbn from 'zxcvbn';

class PasswordStrengthMeter extends Component {


  createPasswordLabel = (result) => {
    switch (result) {
      case 0:
        return 'Debil';
      case 1:
        return 'Debil';
      case 2:
        return 'Normal';
      case 3:
        return 'Buena';
      case 4:
        return 'Segura';
      default:
        return 'Débil';
    }
  }
  nivelSeguridad = (contrasenya) => {
    
    if((/[0-9]/.test(contrasenya) && !/[a-zA-Z!@#$%*]/.test(contrasenya)) || ((contrasenya.length < 2)&&(contrasenya.length > 0))){
      
      return 1;
    }else if(/[a-z+0-9]/.test(contrasenya) && !/[A-Z!@#$%*]/.test(contrasenya)){
      
      return 2;
    }else if(/[a-zA-Z0-9]/.test(contrasenya) && !/[!@#$%*]/.test(contrasenya)){
     
    return 3;
    }else if(/[a-zA-Z0-9!@#$%*]/.test(contrasenya) && (contrasenya.length < 8)){
      return 3;
    
    }else if(/[a-zA-Z0-9!@#$%*]/.test(contrasenya) && (contrasenya.length >= 8)){
     
      return 4;
    }else{
      
      return 0;
    }

  }

  render() {
    const { password } = this.props;
    const testedResult = this.nivelSeguridad(password);
    return (
      <div className="password-strength-meter">
        <progress className={`password-strength-meter-progress strength-${this.createPasswordLabel(testedResult)}`} value={testedResult} max="4"/>
        <br />
        <label className="password-strength-meter-label">
          {password && (
            <>
              {this.createPasswordLabel(testedResult)}
            </>
          )}
        </label>
      </div>
    );
  }
}

export default PasswordStrengthMeter;
