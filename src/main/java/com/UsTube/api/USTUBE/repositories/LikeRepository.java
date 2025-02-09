package com.UsTube.api.USTUBE.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.UsTube.api.USTUBE.models.Like;
import com.UsTube.api.USTUBE.models.Usuario;
import com.UsTube.api.USTUBE.models.Video;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
	Optional<Like> findByUsuarioAndVideo(Usuario usuario, Video video);

    long countByVideo(Video video);

    int countLikesByVideoId(Long videoId);

    List<Like> findByVideoId(Long videoId);
}
