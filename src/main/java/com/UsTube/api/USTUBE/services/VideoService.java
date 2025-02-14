package com.UsTube.api.USTUBE.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.UsTube.api.USTUBE.controller.VideoController;
import com.UsTube.api.USTUBE.controller.VideoDTO;
import com.UsTube.api.USTUBE.models.Usuario;
import com.UsTube.api.USTUBE.models.Video;
import com.UsTube.api.USTUBE.repositories.UsuarioRepository;
import com.UsTube.api.USTUBE.repositories.VideoRepository;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;


@Service
public class VideoService {
    private final UsuarioRepository usuarioRepository;
    private final VideoRepository videoRepository;
    private static final Logger logger = LoggerFactory.getLogger(VideoController.class);


    // Definimos una constante para la ruta de almacenamiento
    //private static final String VIDEO_STORAGE_PATH = "D:/prueba_api";
    private static final String VIDEO_STORAGE_PATH = "/videos";

    //La ruta para las miniaturas
    //private static final String THUMBNAIL_STORAGE_PATH = "D:/prueba_api/miniaturas";
    private static final String THUMBNAIL_STORAGE_PATH = "/miniaturas";
    
    public VideoService(UsuarioRepository usuarioRepository, VideoRepository videoRepository) {
        this.usuarioRepository = usuarioRepository;
        this.videoRepository = videoRepository;
    }

    public void subirVideo(MultipartFile file, Long usuarioId, String title, 
    		String description, MultipartFile miniatura) 
    		throws IOException {
    	System.out.println("Entrando al método subirVideo...");
    	logger.info("Intentando subir video para usuarioId: {}, título: {}", usuarioId, title);
    	
    	// Verificar si el usuario existe
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        // Crear el directorio de almacenamiento si no existe
        File directorio = new File(VIDEO_STORAGE_PATH);
        if (!directorio.exists()) {
        	logger.info("Directorio no existe :( Creando en: {}", VIDEO_STORAGE_PATH );
            boolean creado = directorio.mkdirs();
            if (!creado) {
                throw new IOException("No se pudo crear el directorio de almacenamiento");
            }
        }

        //Crear directorio de las miniaturas
        File directorioMin = new File(THUMBNAIL_STORAGE_PATH);
        if(!directorioMin.exists()) {
        	logger.info("El directorio de las miniaturas se está crando en: {}", THUMBNAIL_STORAGE_PATH);
        	boolean creado = directorioMin.mkdirs();
        	if(!creado) {
        		throw new IOException("No se pudo crear el directorio de miniaturas");
        	}
        }
        
        // Guardar el archivo en el sistema de archivos
        String fileName = file.getOriginalFilename();
        if (fileName == null || fileName.isEmpty()) {
            throw new IllegalArgumentException("El archivo no tiene un nombre válido");
        }

        Path filePath = Paths.get(VIDEO_STORAGE_PATH, fileName);
        Files.write(filePath, file.getBytes());

      
        //Guardar miniatura
        String minName = miniatura.getOriginalFilename();
        if(minName == null || minName.isEmpty()) {
        	throw new IllegalArgumentException("El archivo no tiene un nombre valido");
        }
        
        Path minPath = Paths.get(THUMBNAIL_STORAGE_PATH, minName);
        Files.write(minPath, miniatura.getBytes());
        
        
        // Guardar información del video en la base de datos
        Video video = new Video();
        video.setUsuario(usuario);
        video.setTitulo(title);
        video.setDescripcion(description);
        video.setMiniatura(minPath.toString());
        video.setRuta(filePath.toString()); // Guardamos la ruta completa del archivo
        videoRepository.save(video);
        
    
        logger.info("Guardando archivo en. {}", filePath);
    }

    public Video obtenerVideoPorId(Long id) {
        return videoRepository.findById(id).orElse(null);
    }
    
	public List<VideoDTO> obtenerTodosLosVideos() {
		List<Video> videos = videoRepository.findAll();
		   return videos.stream()
	                .map(VideoDTO::new) // Asumiendo que VideoDTO tiene un constructor que acepta Video
	                .collect(Collectors.toList());
	    }
	
	 public List<VideoDTO> buscarVideos(String titulo) {
	        List<Video> videos = videoRepository.findByTituloContainingIgnoreCase(titulo);
	        return videos.stream()
	                     .map(VideoDTO::new) // Convertir a DTO
	                     .collect(Collectors.toList());
	    }
	
}

