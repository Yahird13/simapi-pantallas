import React, { useEffect, useState } from "react";
import SimapiNavbar from "../../componets/navbar/SimapiNavbar";
import {Table,TableHead,TableBody,TableRow,TableCell,Typography, } from "@material-ui/core"; //instalar con yarn add @material-ui/core
import Button from "../../componets/buttons/Button";
import { isUserAuthenticated } from "../../auth/TokenValidate";
import { pathContext } from "../../utils/PathContext";
import Swal from "sweetalert2";
import { isInstitutionAuthenticated } from "../../auth/InstitutionValidate";
import Loader from "../../componets/loader/Loader";

export default function UsersScreen() {
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsuarios = () => {
    fetch(
      `${pathContext}/api/usuarios/institucion/${localStorage.getItem(
        "idInstitucion"
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    )
      .then((response) => response.json())
      .then((datos) => {
        setUsuarios(datos.data);
      })
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    if (!isUserAuthenticated()) {
      if (!isInstitutionAuthenticated()) {
        window.location.replace("/");
      } else{
        window.location.replace("/inicio");
      }
    } else if (localStorage.getItem("rol") !== "A") {
      if (localStorage.getItem("rol") === "SA") {
        window.location.replace("/administradores");
      } else {
        window.location.replace("/inicio");
      }
    }
  setIsLoading(true);
  fetchUsuarios()
  }, []);
  return (
    <div>
      <SimapiNavbar/>
      {isLoading ? (<Loader/>):(
      <div
        style={{
          margin: "3%",
          marginTop: "10%",
        }}
      >
        <div
          style={{
            width: "100%",
            marginBottom: 25,
            display: "flex",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "right",
          }}
        >
          <Button
            text={"Agregar Usuario"}
            style={styles.btnAgregarUsuario}
            onClick={() => window.location.replace("/agregarUsuario")}
          />
        </div>

        <div
          style={{
            borderRadius: "15px",
            border: "5px solid black",
            minHeight: 415,
            width: "100%",
          }}
        >
          <div
            style={{
              padding: "20px",
              width: "100%",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      style={styles.center}
                    >
                      No.
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      style={styles.center}
                    >
                      Nombre
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      style={styles.center}
                    >
                      Rol
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      style={styles.center}
                    >
                      Acciones
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usuarios
                  ? usuarios.map((item, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell>
                            <label
                              style={{ ...styles.center, fontSize: "18px" }}
                            >
                              {index + 1}
                            </label>
                          </TableCell>
                          <TableCell>
                            <label
                              style={{ ...styles.center, fontSize: "18px" }}
                            >
                              {`${item.nombre} ${item.apellidos}`}
                            </label>
                          </TableCell>
                          <TableCell>
                            <label
                              style={{ ...styles.center, fontSize: "18px" }}
                            >
                              {item.rol === "E"
                                ? "Enfermera/o"
                                : item.rol === "A"
                                ? "Administrador"
                                : null}
                            </label>
                          </TableCell>
                          <TableCell
                            style={{ ...styles.center, fontSize: "18px" }}
                          >
                            <Button
                              text={"Detalles"}
                              style={styles.btnDetallesUsuario}
                              onClick={() => {
                                localStorage.setItem(
                                  "idUsuarioEdit",
                                  item.idUsuario
                                );
                                window.location.replace("/detallesUsuario");
                              }}
                            />
                            <Button
                              text={"Editar"}
                              style={styles.btnEditarUsuario}
                              onClick={() => {
                                localStorage.setItem(
                                  "idUsuarioEdit",
                                  item.idUsuario
                                );
                                window.location.replace("/editarUsuario");
                              }}
                            />

                            { item.rol !== 'A' ? 
                            (<Button
                              text={"Eliminar"}
                              style={styles.btnEliminarUsuario}
                              onClick={() => {
                                Swal.fire({
                                  title: "¿Estás seguro?",
                                  text: "¡No podrás revertir esto!",
                                  icon: "warning",
                                  showCancelButton: true,
                                  confirmButtonColor: "#3085d6",
                                  cancelButtonColor: "#d33",
                                  confirmButtonText: "¡Sí, bórralo!",
                                }).then((result) => {
                                  if (result.isConfirmed) {
                                    fetch(
                                      `${pathContext}/api/usuarios/${item.idUsuario}`,
                                      {
                                        method: "DELETE",
                                        headers: {
                                          "Content-Type": "application/json",
                                          Authorization:
                                            "Bearer " +
                                            localStorage.getItem("token"),
                                        },
                                      }
                                    )
                                      .then((response) => response.json())
                                      .then((datos) => {
                                        if (!datos.error) {
                                          Swal.fire({
                                            title: "¡Eliminado!",
                                            text: datos.message,
                                            icon: "success",
                                            showConfirmButton: false,
                                            showCloseButton: true,
                                            timer: 2000,
                                            timerProgressBar: true,
                                            allowOutsideClick: false,
                                            allowEscapeKey: false,
                                            allowEnterKey: false,
                                            stopKeydownPropagation: false,
                                          })
                                          fetchUsuarios()
                                        } else {
                                          throw new Error(datos.message);
                                        }
                                      })
                                      .catch((error) =>{
                                        Swal.fire({
                                          title: "¡Error!",
                                          text: error.message,
                                          icon: "error",
                                          showConfirmButton: false,
                                          showCloseButton: true,
                                        });
                                      });
                                  }
                                });
                              }}
                            />) : null
                            }
                          </TableCell>
                        </TableRow>
                      );
                    })
                  : null}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>)}
    </div>
  );
}

const styles = {
  btnAgregarUsuario: {
    width: "200px",
    height: "50px",
    backgroundColor: "#3fad5e",
  },
  btnEditarUsuario: {
    width: "100px",
    backgroundColor: "#FFFF00",
    marginRight: "10px",
  },
  btnEliminarUsuario: {
    width: "120px",
    backgroundColor: "#FF0000",
    marginRight: "10px",
  },
  btnDetallesUsuario: {
    width: "120px",
    backgroundColor: "#1B8CF4",
    marginRight: "10px",
  },
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};
