package com.UsTube.api.USTUBE.controller;

import com.UsTube.api.USTUBE.models.Video;

public class VideoDTO {
    private Long id;
    private String titulo;
    private String descripcion;
    private String ruta;
    private String username; // Solo el nombre de usuario del propietario

    public VideoDTO(Video video) {
        this.id = video.getId();
        this.titulo = video.getTitulo();
        this.descripcion = video.getDescripcion();
        this.ruta = video.getRuta();
        this.username = video.getUsuario().getUsername(); // Extrae solo el username
    }

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTitulo() {
		return titulo;
	}

	public void setTitulo(String titulo) {
		this.titulo = titulo;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public String getRuta() {
		return ruta;
	}

	public void setRuta(String ruta) {
		this.ruta = ruta;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

}
