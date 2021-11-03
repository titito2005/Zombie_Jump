## Paso de mensajes

- Luis crear partida

  ```json
  send {
  "tipo": "inicar partida",
  "datos"{
      "jugador " : "Luis",
      "jugador " : "Jose"
  	}
  } to Server
  ```

- Server:
  - Crear mazo.
  - Revolver mazo.
  - Inicializar Zombie
  - Establece orden jugadores.
  - Inicializar puntajes de cada casilla Inicializar color de cada casilla.


```json
 broadcast {
"tipo": "juagador_activo",
"datos"{
	  "nombre" : "Luis",
	  "puntaje": "0 pts",
	  "activo": "Vivo",
	  "posicion": "Peligrosa"
  }
}
```

- Luis:
  - Inactivos todos los jugadores
  
  - IF (soy_jugador_activo){

    Hacerme_Activo Mostrarme como jugador activo 
  
    }ELSE{ 
  
    Mostrarme jugador activo
  
    }

  
- Jose:
  - Inactivos todos los jugadores
  
  - IF (soy_jugador_activo){
  
    Hacerme_Activo Mostrarme como jugador activo 
  
    }ELSE{ 
  
    Mostrarme jugador activo
  
    }
  

- Luis:
  - click en deck
    ```json
    send {
        "tipo": "solicitud carta",
    } to Server
    ```
  
- Server:
  ```json
  send {
  "tipo": "carta",
  "datos"{
      "color" : "rojo",
      "Jugador" : "player"
  	}
  } to Luis
  ```

- Luis:
  - click en color rojo para moverse
  - fin de turno
  - sumar puntos
  - active player = false
  - mensaje de movimiento
    ```json
    send {
    "tipo": "movimiento",
    "datos"{
        "jugador" : "Luis",
        "posicionX" : "5",
        "posicionY" : "3",
      }
    } to Server
    ```

- Sever:
  - broadcast de movimiento
    ```json
     broadcast {
    "tipo": "movimiento jugador",
    "datos"{
        "jugador" : "Luis",
        "posicionX" : "5",
        "posicionY" : "3",
     }
    }
    ```
  
- Server:
```json
 broadcast {
"tipo": "juagador_activo",
"datos"{
    "nombre" : "Jose",
    "puntaje": "0 pts",
    "activo": "Vivo",
    "posicion": "Peligrosa",
  }
}
```

- Jose:
    - Inactivos todos los jugadores
    
    - IF (soy_jugador_activo){

      Hacerme_Activo Mostrarme como jugador activo 
    
      }ELSE{ 
    
      Mostrarme jugador activo
    
      }
    
- Luis:
    - Inactivos todos los jugadores
    
    - IF (soy_jugador_activo){
    
      Hacerme_Activo Mostrarme como jugador activo 
    
      }ELSE{ 
    
      Mostrarme jugador activo
    
      }
    
- Jose:
    - click en deck  
      ```json
      send {
      "tipo": "solicitud carta",
      } to Server
      ```
    
- Server:
```json
send {
  "tipo": "carta",
  "datos"{
      "color" : "verde",
      "jugador" : "player",
  	}
  } to Jose
  ```
  
- Jose
  - click en color verde para moverse
  - fin de turno
  - sumar puntos
  - active player = false
  - mensaje de movimiento

    ```json
    send {
    "tipo": "movimiento",
    "datos"{
        "jugador" : "Jose",
        "posicionX" : "4",
        "posicionY" : "2",
      }
    } to Server
    ```

- Server:
  - broadcast de movimiento
    ```json
     broadcast {
    "tipo": "movimiento jugador",
    "datos"{
        "jugador" : "Jose",
        "posicionX" : "4",
        "posicionY" : "2",
      }
    }
    ```
  
- Server:
  ```json
   broadcast {
  "tipo": "juagdor_activo",
  "datos"{
      "nombre" : "Luis",
      "puntaje": "1 pts",
      "activo": "Vivo",
      "posicion": "Peligrosa",
    }
  }
  ```

- Luis:
    - Inactivos todos los jugadores
    
    - IF (soy_jugador_activo){

      Hacerme_Activo Mostrarme como jugador activo 
    
      }ELSE{ 
    
      Mostrarme jugador activo
    
      }
    
-  Jose:
    - Inactivos todos los jugadores
    
    - IF (soy_jugador_activo){

      Hacerme_Activo Mostrarme como jugador activo 
    
      }ELSE{ 
    
      Mostrarme jugador activo
    
      }
    
- Luis:
  - click en deck
    ```json
    send {
    "tipo": "solicitud carta",
    "datos"{
        "jugador " : "carta"
    	}
    } to Server
    ```

- Sever:
  ```json
  send {
  "tipo": "carta",
  "datos"{
      "color" : "azul",
      "player" : "Zombie",
  	}
  } to Luis
  ```

- Luis:
  - click en color azul para mover a zombie.
  - fin de turno.
  - mensaje movimiento zombie
    ```json
    send {
    "tipo": "movimiento",
    "datos"{
        "jugador" : "Zombie",
        "posicionX" : "3",
        "posicionY" : "1",
      }
    } to Server
    ```


- Server:
  - broadcast de movimiento 
    ```json
    "tipo": "movimiento jugador",
    "datos"{
        "jugador" : "Zombie",
        "posicionX" : "3",
        "posicionY" : "1",
      }
    }
    ```

    
- Server:
  ```json
   broadcast {
  "tipo": "juagdor_activo",
  "datos"{
      "nombre" : "Jose",
      "puntaje": "1 pts",
      "activo": "Vivo",
      "posicion": "Peligrosa",
    }
  }
  ```

- Luis:
  - Inactivos todos los jugadores

  - IF (soy_jugador_activo){

    Hacerme_Activo Mostrarme como jugador activo 

    }ELSE{ 

    Mostrarme jugador activo

    }

- Jose:
  - Inactivos todos los jugadores

  - IF (soy_jugador_activo){

    Hacerme_Activo Mostrarme como jugador activo 

    }ELSE{ 

    Mostrarme jugador activo

    }

- Jose:
  - click en deck
    ```json
    send {
        "tipo": "solicitud carta",
    } to Server
    ```

- Server:
  ```json
  send {
  "tipo": "carta",
  "datos"{
      "color" : "azul",
      "jugador": "player",
  	}
  } to Jose
  ```


- Jose:
  - click en color azul para moverse
  - fin de turno
  - sumar puntos
  - active player = false
  - mensaje movimiento
  ```json
  send {
  "tipo": "movimiento",
  "datos"{
      "jugador" : "Jose",
      "posicionX" : "6",
      "posicionY" : "4",
    }
  } to Server
  ```

- Server:
  - broadcast de movimiento 
    ```json
    "tipo": "movimiento jugador",
    "datos"{
        "jugador" : "Jose",
        "posicionX" : "6",
        "posicionY" : "4",
      }
    }
    ```

- Server:

```json
 broadcast {
"tipo": "juagador_activo",
"datos"{
      "nombre" : "Luis",
      "puntaje": "1 pts",
      "activo": "Vivo",
      "posicion": "Peligrosa",
  }
}
```

- Luis:
  - Inactivos todos los jugadores
  
  - IF (soy_jugador_activo){
  
    Hacerme_Activo Mostrarme como jugador activo 
  
    }ELSE{ 
  
    Mostrarme jugador activo
  
    }

- Jose:
  - Inactivos todos los jugadores
  
  - IF (soy_jugador_activo){

    Hacerme_Activo Mostrarme como jugador activo 
  
    }ELSE{ 
  
    Mostrarme jugador activo
  
    }
  
- Luis:
  - click en deck  
    ```json
    send {
        "tipo": "solicitud carta",
    } to Server
    ```
  
- Server:
  ```json
  send {
      "tipo": "carta",
      "datos"{
      "color" : "azul",
      "juagador": "player"
  	}
  } to Luis
  ```


- Luis
  - click en color azul para moverse
  - fin de turno
  - sumar puntos
  - active player = false
  - mensaje movimiento

  ```json
  send {
  "tipo": "movimiento",
  "datos"{
      "jugador" : "Luis",
      "posicionX" : "7",
      "posicionY" : "3",
    }
  } to Server
  ```

- Sever:
    - broadcast de movimiento 
    ```json
    "tipo": "movimiento jugador",
    "datos"{
        "jugador" : "Luis",
        "posicionX" : "7",
        "posicionY" : "3",
      }
    }
    ```

- Server:
  ```json
   broadcast {
  "tipo": "juagdor_activo",
  "datos"{
      "nombre" : "Jose",
      "puntaje": "9 pts",
      "activo": "Vivo",
      "posicion": "Peligrosa",
    }
  }
  ```

- Luis:
  - Inactivos todos los jugadores

  - IF (soy_jugador_activo){

    Hacerme_Activo Mostrarme como jugador activo 

    }ELSE{ 

    Mostrarme jugador activo

    }


- Jose:
  - Inactivos todos los jugadores

  - IF (soy_jugador_activo){

    Hacerme_Activo Mostrarme como jugador activo 

    }ELSE{ 

    Mostrarme jugador activo

    }


- Jose:
  - click en deck
    ```json
    send {
        "tipo": "solicitud carta",
    } to Server
    ```


- Server
  ```json
  send {
  "tipo": "carta",
  "datos"{
      "color" : "azul",
      "jugador": "player",
  	}
  } to Jose
  ```


- Jose
  - click en color azul para moverse
  - fin de turno
  - sumar puntos
  - active player = false
  - mensaje movimiento

  ```json
  send {
  "tipo": "movimiento",
  "datos"{
      "jugador" : "Jose",
      "posicionX" : "1",
      "posicionY" : "3",
    }
  } to Server
  ```

- Server
  - broadcast de movimiento 
    ```json
    "tipo": "movimiento jugador",
    "datos"{
        "jugador" : "Jose",
        "posicionX" : "1",
        "posicionY" : "3",
      }
    }
    ```

- Server
  ```json
   broadcast {
  "tipo": "juagador_activo",
  "datos"{
      "nombre" : "Luis",
      "puntaje": "6 pts",
      "activo": "Vivo",
      "posicion": "Peligrosa",
    }
  }
  ```


- Luis:

  - Inactivos todos los jugadores
  - IF (soy_jugador_activo){

    Hacerme_Activo Mostrarme como jugador activo 

    }ELSE{ 

    Mostrarme jugador activo

    }

- Jose:
  - Inactivos todos los jugadores

  - IF (soy_jugador_activo){

    Hacerme_Activo Mostrarme como jugador activo 

    }ELSE{ 

    Mostrarme jugador activo

    }  


- Luis
  - click en deck
    ```json
    send {
        "tipo": "solicitud carta",
    } to Server
    ```

    
- Server:
  ```json
  send {
  "tipo": "carta",
  "datos"{
      "color" : "amarilla",
      "jugador": "player",
  	}
  } to Luis
  ```

- Luis:
  - click en color amarillo para moverse
  - fin de turno
  - sumar puntos
  - active player = false
  - mensaje movimiento

  ```json
  send {
  "tipo": "movimiento",
  "datos"{
      "jugador" : "Luis",
      "posicionX" : "6",
      "posicionY" : "1",
    }
  } to Server
  ```

- Server
  - broadcast de movimiento 
    ```json
    "tipo": "movimiento jugador",
    "datos"{
        "jugador" : "Luis",
        "posicionX" : "6",
        "posicionY" : "1",
      }
    }
    ```

- Server:
  ```json
   broadcast {
  "tipo": "juagdor_activo",
  "datos"{
      "nombre" : "Jose"
      "puntaje": "10 pts"
      "activo": "Vivo"
      "posicion": "Peligrosa"
    }
  }
  ```


- Luis
  - Inactivos todos los jugadores

  - IF (soy_jugador_activo){

    Hacerme_Activo Mostrarme como jugador activo 

    }ELSE{ 

    Mostrarme jugador activo

    }  

- José:
  - Inactivos todos los jugadores

  - IF (soy_jugador_activo){

    Hacerme_Activo Mostrarme como jugador activo 

    }ELSE{ 

    Mostrarme jugador activo

    }  

- Jose:
  - click en deck
    ```json
    send {
    "tipo": "solicitud carta",
    } to Server
    ```

- Server:
  ```json
  send {
  "tipo": "carta",
  "datos"{
      "color" : "amarillo",
      "jugador": "Zombie",
  	}
  } to Jose
  ```

- Jose
  - click en color amarillo para mover a zombie.
  - fin de turno
  - active player = false
  - mensaje movimiento zombie

  ```json
  send {
  "tipo": "movimiento",
  "datos"{
      "jugador" : "Zombie",
      "posicionX" : "3",
      "posicionY" : "4",
    }
  } to Server
  ```

- Server
  - broadcast de movimiento 
    ```json
    "tipo": "movimiento jugador",
    "datos"{
        "jugador" : "Zombie",
        "posicionX" : "3",
        "posicionY" : "4",
      }
    }
    ```

- Server
  ```json
   broadcast {
  "tipo": "juagador_activo",
  "datos"{
      "nombre" : "Luis",
      "puntaje": "7 pts",
      "activo": "Vivo",
      "posicion": "Peligrosa",
    }
  }
  ```

- Luis
  - Inactivos todos los jugadores

  - IF (soy_jugador_activo){

    Hacerme_Activo Mostrarme como jugador activo 

    }ELSE{ 

    Mostrarme jugador activo

    }  

- Jose

  - Inactivos todos los jugadores

  - IF (soy_jugador_activo){

    Hacerme_Activo Mostrarme como jugador activo 

    }ELSE{ 

    Mostrarme jugador activo

    }  

- Luis:
  - click en deck
    ```json
    send {
        "tipo": "solicitud carta",
    } to Server
    ```

- Server:
  ```json
  send {
  "tipo": "carta",
  "datos"{
      "color" : "verde",
      "jugador": "player",
  	}
  } to Luis
  ```

- Luis
  - click en color verde para mover.
  - fin de turno
  - sumar puntos
  - active player = false
  - mensaje movimiento
  ```json
  send {
  "tipo": "movimiento",
  "datos"{
      "jugador" : "Luis",
      "posicionX" : "5",
      "posicionY" : "8",
    }
  } to Server
  ```

- Server
  - broadcast de movimiento 
    ```json
    "tipo": "movimiento jugador",
    "datos"{
        "jugador" : "Luis",
        "posicionX" : "5",
        "posicionY" : "8",
      }
    }
    ```

- Server:
  ```json
   broadcast {
  "tipo": "juagador_activo",
  "datos"{
      "nombre" : "Jose",
      "puntaje": "10 pts",
      "activo": "Vivo",
      "posicion": "Peligrosa",
    }
  }
  ```

- Luis
  - Inactivos todos los jugadores

  - IF (soy_jugador_activo){

    Hacerme_Activo Mostrarme como jugador activo 

    }ELSE{ 

    Mostrarme jugador activo

    }  

- Jose:
  - Inactivos todos los jugadores

  - IF (soy_jugador_activo){

    Hacerme_Activo Mostrarme como jugador activo 

    }ELSE{ 

    Mostrarme jugador activo

    }  


- Jose
  - click en deck
    ```json
    send {
        "tipo": "solicitud carta",
    } to Server
    ```

- Server
  ```json
  send {
  "tipo": "carta",
  "datos"{
      "color" : "verde",
      "Jugador": "zombie",
  	}
  } to Jose
  ```

- Jose
  - click en color verde para mover zombie.
  - fin de turno
  - active player = false
  - mensaje movimiento zombie
  ```json
  send {
  "tipo": "movimiento",
  "datos"{
      "jugador" : "Zombie",
      "posicionX" : "1",
      "posicionY" : "2",
    }
  } to Server
  ```

- Server:
  - broadcast de movimiento 
    ```json
    "tipo": "movimiento jugador",
    "datos"{
        "jugador" : "Zombie",
        "posicionX" : "1",
        "posicionY" : "2",
      }
    }
    ```

- Server:
  ```json
  broadcast {
  "tipo": "muerte_jugador",
  "datos"{
      "nombre" : "Luis",
      "activo": "muerto",
    }
  }
  ```

- Server:
  ```json
  broadcast {
  "tipo": "juagador_activo",
  "datos"{
      "nombre" : "Jose",
      "puntaje": "10 pts",
      "activo": "Vivo",
      "posicion": "Peligrosa",
    }
  }
  ```


- Jose
  - Inactivos todos los jugadores

  - IF (soy_jugador_activo){

    Hacerme_Activo Mostrarme como jugador activo 

    }ELSE{ 

    Mostrarme jugador activo

    }  

- Jose
  - click en deck
    ```json
    send {
        "tipo": "solicitud carta",
    } to Server
    ```

- Sever:
  ```json
  send {
  "tipo": "carta",
  "datos"{
      "color" : "rojo",
      "jugador": "player",
  	}
  } to Jose
  ```

- Jose
  - click en color rojo para mover.
  - fin de turno
  - sumar puntos
  - active player = false
  - mensaje movimiento
  ```json
  send {
  "tipo": "movimiento",
  "datos"{
      "jugador" : "Jose",
      "posicionX" : "4",
      "posicionY" : "5",
    }
  } to Server
  ```

- Server:
  - broadcast de movimiento 
    ```json
    "tipo": "movimiento jugador",
    "datos"{
        "jugador" : "Jose",
        "posicionX" : "4",
        "posicionY" : "5",
      }
    }
    ```

- Server:
  ```json
  broadcast {
  "tipo": "juagdor_activo",
  "datos"{
      "nombre" : "Jose",
      "puntaje": "10 pts",
      "activo": "Vivo",
      "posicion": "Peligrosa",
    }
  }
  ```

- Jose:
  - Inactivos todos los jugadores

  - IF (soy_jugador_activo){

    Hacerme_Activo Mostrarme como jugador activo 

    }ELSE{ 

    Mostrarme jugador activo

    }  

- Jose :
  - click en deck
    ```json
    send {
        "tipo": "solicitud carta",
    } to Server
    ```

- Server:
  ```json
  send {
  "tipo": "carta",
  "datos"{
      "color" : "amarillo",
      "jugador": "player",
  	}
  } to Jose
  ```


- Jose
  - click en zona segura para mover.
  - fin de turno
  - sumar puntos
  - active player = false
  - mensaje movimiento
  ```json
  send {
  "tipo": "movimiento",
  "datos"{
      "jugador" : "Jose",
      "posicionX" : "7",
      "posicionY" : "3",
    }
  } to Server
  ```

- Sever:
  ```json
  broadcast {
  "tipo": "final del juego",
  "datos"{
      "ganador" : "Jose",
      "puntaje": "10 pts",
      "nombre" : "Luis",
      "puntaje": "10 pts",
    }
  }
  ```

