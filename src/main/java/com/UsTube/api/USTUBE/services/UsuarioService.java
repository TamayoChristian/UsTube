package com.UsTube.api.USTUBE.services;

import com.UsTube.api.USTUBE.models.Usuario;
import com.UsTube.api.USTUBE.repositories.UsuarioRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Value("${spring.security.jwt.secret}")
    private String secretKey;
    
    @Value("${spring.security.jwt.expiration}")
    private long jwtExpiration;

    public void registrarUsuario(Usuario usuario) {
        usuarioRepository.save(usuario);
    }

    public boolean autenticarUsuario(String username, String password) {
        Usuario usuario = usuarioRepository.findByUsernameAndPassword(username, password);
        return usuario != null;
    }

    public Usuario obtenerUsuarioPorId(Long id) {
        return usuarioRepository.findById(id).orElse(null);
    }

    public String generateJwt(String username) {
        Map<String, Object> claims = new HashMap<>();
        return createJwt(claims, username);
    }

    private String createJwt(Map<String, Object> claims, String username) {
       try {
    	   return Jwts.builder()
                   .setClaims(claims)
                   .setSubject(username)
                   .setIssuedAt(new Date(System.currentTimeMillis()))
                   .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                   .signWith(getSignKey(), SignatureAlgorithm.HS256)
                   .compact();
	} catch (Exception e) {
			System.out.println("Error " + e.getMessage());
			return null;
		}
    }

    private Key getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
    
    public Usuario obtenerUsuarioPorUsername(String username) {
        return usuarioRepository.findByUsername(username);
    }
    
    
    ////
    public String extractJwtFromCookie(HttpServletRequest request) {
        if (request.getCookies() != null) {
            Optional<Cookie> jwtCookie = Arrays.stream(request.getCookies())
                .filter(cookie -> "authToken".equals(cookie.getName()))
                .findFirst();
            return jwtCookie.map(Cookie::getValue).orElse(null);
        }
        return null;
    }







}
