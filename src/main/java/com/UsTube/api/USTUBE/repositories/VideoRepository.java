package com.UsTube.api.USTUBE.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.UsTube.api.USTUBE.models.Video;

public interface VideoRepository extends JpaRepository<Video, Long> {
	@Query(value = "SELECT * FROM video ORDER BY RAND() LIMIT 1", nativeQuery = true)
	List<Video> findRandomVideos();
}
