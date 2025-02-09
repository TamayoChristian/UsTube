package com.UsTube.api.USTUBE.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.UsTube.api.USTUBE.models.Like;
import com.UsTube.api.USTUBE.models.Usuario;
import com.UsTube.api.USTUBE.models.Video;
import com.UsTube.api.USTUBE.services.LikeService;
import com.UsTube.api.USTUBE.services.UsuarioService;
import com.UsTube.api.USTUBE.services.VideoService;

import jakarta.persistence.EntityNotFoundException;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/likes")
public class LikeController {
    private final LikeService likeService;
    private final VideoService videoService;
    private final UsuarioService usuarioService;

    @Autowired
    public LikeController(LikeService likeService, VideoService videoService, UsuarioService usuarioService) {
        this.likeService = likeService;
        this.videoService = videoService;
        this.usuarioService = usuarioService;
    }

    @PostMapping("/{videoId}/like")
    public ResponseEntity<String> darLike(@PathVariable Long videoId, @RequestBody Long usuarioId) {
        Usuario usuario = usuarioService.obtenerUsuarioPorId(usuarioId);
        Video video = videoService.obtenerVideoPorId(videoId);

        if (usuario == null || video == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Usuario o video no encontrado.");
        }
        
        boolean likeexistente = likeService.agregarLike(usuario, video);

        if (likeexistente) {
        	return ResponseEntity.ok("Like agregado");
        } else {
        	return ResponseEntity.status(HttpStatus.CONFLICT).body("el usuario ya ha dado like");
        }
    }


    //Esta función borra los likes, reecibe un objeto DislikeRequest 
    @DeleteMapping("/{videoId}/likes/{usuarioId}")
    public ResponseEntity<String> quitarLike(@PathVariable Long videoId, @PathVariable Long usuarioId) {

    	
        Usuario usuario = usuarioService.obtenerUsuarioPorId(usuarioId);
        Video video = videoService.obtenerVideoPorId(videoId);

        if (usuario == null || video == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Usuario o video no encontrado.");
        	
        }

       boolean dislikeexiste = likeService.eliminarLike(usuario, video);
     
       if (dislikeexiste) {
    	   return ResponseEntity.ok("Like quitado");
       } else {
    	   return ResponseEntity.status(HttpStatus.CONFLICT).body("No has dado like");
       }
        
    }



    @GetMapping("/count") 
    public ResponseEntity<Long> contarLikes(@RequestParam Long videoId) {
        Video video = videoService.obtenerVideoPorId(videoId);
        long cantidadLikes = likeService.getLikesForVideo(video);
        return ResponseEntity.ok(cantidadLikes);
    }
    @GetMapping("/{videoId}/likes")
    public int obtenerCantidadDeLikes(@PathVariable Long videoId) {
        return likeService.contarLikesDeVideo(videoId);
    }

    @GetMapping("/{videoId}/likes/detalle")
    public List<Like> obtenerLikesDetalle(@PathVariable Long videoId) {
        return likeService.obtenerLikesDeVideo(videoId);
    }
    
    //Valida que el usuario que de like, exista
    @RestControllerAdvice
    public class GlobalExceptionHandler {
        @ExceptionHandler(EntityNotFoundException.class)
        public ResponseEntity<String> handleEntityNotFound(EntityNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }

        @ExceptionHandler(Exception.class)
        public ResponseEntity<String> handleGeneralException(Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Ocurrió un error interno.");
        }
    }


}



