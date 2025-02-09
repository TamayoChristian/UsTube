package com.UsTube.api.USTUBE.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.UsTube.api.USTUBE.models.Video;
import com.UsTube.api.USTUBE.repositories.VideoRepository;
import com.UsTube.api.USTUBE.services.UsuarioService;
import com.UsTube.api.USTUBE.services.VideoService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.core.io.Resource;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/videos")
public class VideoController {
    private final VideoService videoService;
    private final UsuarioService usuarioService;
    private VideoRepository videoRepository;
    private static final Logger logger = LoggerFactory.getLogger(VideoService.class);

    @Autowired
    public VideoController(VideoService videoService, UsuarioService usuarioService) {
        this.videoService = videoService;
        this.usuarioService = usuarioService;
    }

    @PostMapping("/subir")
    public ResponseEntity<String> subirVideo(@RequestParam("file") MultipartFile file, 
    		@RequestParam("usuarioId") Long usuarioId, @RequestParam("title") String title,
    		@RequestParam("description")String description, HttpServletRequest request) throws IOException {
    	System.out.println("Entrando al método para subir videos");
    	
    	//Valida que exista el titulo del video.
    	if (file.isEmpty()) {
    	    return ResponseEntity.badRequest().body("El archivo no puede estar vacío");
    	}
    	// Guardar el archivo en el sistema de archivos o base de datos
    	//videoService.subirVideo(file, usuarioId, title);
    	
    	String token = usuarioService.extractJwtFromCookie(request);
    	if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No autorizado");
        }
    	
    	 if (usuarioService.obtenerUsuarioPorId(usuarioId) == null) {
             return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
         }
    	
    	try {
    		
    		System.out.println("Usuario ID recibido: " + usuarioId);
            System.out.println("Título recibido: " + title);
            System.out.println("Archivo recibido: " + file.getOriginalFilename());
    	    videoService.subirVideo(file, usuarioId, title, description);
    	    return ResponseEntity.ok("Video subido con éxito");
    	} catch (Exception e) {
    	    logger.error("Error al subir el video", e); // Incluye la traza completa
    	    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Ocurrió un error al subir el video.");
    	}

    	
       // return ResponseEntity.ok("Video subido con éxito");
    }
    @GetMapping
    public ResponseEntity<List<Video>> obtenerVideos() {
        List<Video> videos = videoService.obtenerTodosLosVideos();
        return ResponseEntity.ok(videos);
    }
    @GetMapping("/ver/{id}")
    public ResponseEntity<Resource> verVideo(@PathVariable Long id) {
        Video video = videoService.obtenerVideoPorId(id);
        if (video == null) {
            return ResponseEntity.notFound().build();
        }

        Path videoPath = Paths.get(video.getRuta());  // Ruta del video almacenado
        Resource videoResource = new FileSystemResource(videoPath.toFile());

        return ResponseEntity.ok()
                .contentType(MediaType.valueOf("video/mp4"))
                .body(videoResource);
    }

    @GetMapping("/recuperar/{id}")
    public ResponseEntity<VideoDTO> recuperarVideoPorId(@PathVariable("id") Long id) {
        Video video = videoService.obtenerVideoPorId(id);
        if (video == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(new VideoDTO(video));
    }
   /* public Optional<Video> recuperarVideoPorId(@PathVariable("id")Long id){
		return Optional.ofNullable(this.videoService.obtenerVideoPorId(id));
    }*/
   
    
    @GetMapping("/random")
    public List<Video> getRandomVideos() {
        return videoRepository.findRandomVideos(); // Devuelve 10 videos aleatorios
    }
}
