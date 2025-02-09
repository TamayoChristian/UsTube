package com.UsTube.api.USTUBE.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.UsTube.api.USTUBE.models.Like;
import com.UsTube.api.USTUBE.models.Usuario;
import com.UsTube.api.USTUBE.models.Video;
import com.UsTube.api.USTUBE.repositories.LikeRepository;

@Service
public class LikeService {
    @Autowired
    private LikeRepository likeRepository;

    public boolean agregarLike(Usuario usuario, Video video) {
    	
    	Optional<Like> existLike = likeRepository.findByUsuarioAndVideo(usuario, video);
    	
    	if (existLike.isPresent()) {
    		return false;
    		
        } else {
            Like like = new Like();
            like.setUsuario(usuario);
            like.setVideo(video);
            likeRepository.save(like);
            return true;
        }
    	
    }

    public boolean eliminarLike(Usuario usuario, Video video) {
    	System.out.println("Intentando eliminar like de usuario: " + usuario.getId() + " en el video: " + video.getId());
    	Optional<Like> likeOptional = likeRepository.findByUsuarioAndVideo(usuario, video);
    	
    	if (likeOptional.isPresent()) {
        	System.out.println("Like encontrado, eliminando...");
        	likeRepository.delete(likeOptional.get());
        	return true;

        } else {
        	return false;
        }
    }

    public long getLikesForVideo(Video video) {
        return likeRepository.countByVideo(video);
    }

    public int contarLikesDeVideo(Long videoId) {
        return likeRepository.countLikesByVideoId(videoId);
    }

    public List<Like> obtenerLikesDeVideo(Long videoId) {
        return likeRepository.findByVideoId(videoId);
    }
}
