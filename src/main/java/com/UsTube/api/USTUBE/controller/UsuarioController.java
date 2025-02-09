package com.UsTube.api.USTUBE.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.UsTube.api.USTUBE.models.Usuario;
import com.UsTube.api.USTUBE.services.UsuarioService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    private final UsuarioService usuarioService;

    @Autowired
    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/registro")
    public ResponseEntity<String> registrarUsuario(@RequestBody Usuario usuario) {
        usuarioService.registrarUsuario(usuario);
        return ResponseEntity.ok("Usuario registrado con éxito");
    }

  /*  
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginUser(@RequestBody Usuario usuario) {
        boolean autenticado = usuarioService.autenticarUsuario(usuario.getUsername(), usuario.getPassword());
        if (autenticado) {
            // Obtener el usuario por username para obtener su ID
            Usuario usuarioAutenticado = usuarioService.obtenerUsuarioPorUsername(usuario.getUsername());
            if (usuarioAutenticado != null) {
            	
            	////Borrar
            	System.out.println(usuarioAutenticado.getUsername());
                
            	String token = usuarioService.generateJwt(usuario.getUsername());
            	
            	System.out.println(token);
            	
            	Map<String, String> response = new HashMap<>();
            	
            	response.put("token", token);
            	return ResponseEntity.ok(response);                
            } else {
            	return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "Error interno del servidor"));
            }
        } else {
        	 return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("error", "Credenciales inválidas"));
        }
    }*/
    
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginUser(@RequestBody Usuario usuario, HttpServletResponse response) {
        boolean autenticado = usuarioService.autenticarUsuario(usuario.getUsername(), usuario.getPassword());
        if (autenticado) {
            Usuario usuarioAutenticado = usuarioService.obtenerUsuarioPorUsername(usuario.getUsername());
            if (usuarioAutenticado != null) {
                String token = usuarioService.generateJwt(usuario.getUsername());

                // Crear una cookie con el token (opcional)
                Cookie cookie = new Cookie("authToken", token);
                cookie.setHttpOnly(true);
                cookie.setSecure(false); // Cambiar a true en producción con HTTPS
                cookie.setPath("/");
                cookie.setMaxAge(3600);
                response.addCookie(cookie);

                // Responder con token y userId en el cuerpo
                Map<String, String> responseBody = new HashMap<>();
                responseBody.put("token", token);
                responseBody.put("userId", String.valueOf(usuarioAutenticado.getId()));

                
                System.out.println(usuario.getUsername());
                System.out.println(token);
                return ResponseEntity.ok(responseBody);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "Error interno del servidor"));
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("error", "Credenciales inválidas"));
        }
    }

    
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("authToken", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);  // Expira inmediatamente
        response.addCookie(cookie);

        return ResponseEntity.ok("Sesión cerrada");
    }



}
