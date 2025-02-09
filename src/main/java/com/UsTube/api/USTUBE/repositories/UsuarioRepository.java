package com.UsTube.api.USTUBE.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.UsTube.api.USTUBE.models.Usuario;



public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Usuario findByUsernameAndPassword(String username, String password);

	Usuario findByUsername(String username);
}
