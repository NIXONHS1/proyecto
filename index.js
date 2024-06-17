<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Juego de la Frase Interminable</title>
    <style>
        pre {
            background-color: #f4f4f4;
            padding: 10px;
            border: 1px solid #ddd;
            overflow-x: auto;
        }
        code {
            font-family: Consolas, "Courier New", monospace;
        }
    </style>
</head>
<body>
    <h1>Juego de la Frase Interminable</h1>
    <script>
        class Jugador {
            constructor(nombre, teclaAceptacion, teclaRechazo) {
                this.nombre = nombre;
                this.teclaAceptacion = teclaAceptacion;
                this.teclaRechazo = teclaRechazo;
                this.puntuacion = 0;
                this.tiempo = 0;
            }

            toString() {
                return `Nombre: ${this.nombre}, Tecla de Aceptación: ${this.teclaAceptacion}, Tecla de Rechazo: ${this.teclaRechazo}`;
            }

            sumarTiempo(tiempo) {
                this.tiempo += tiempo;
            }

            puntuar(puntos) {
                this.puntuacion += puntos;
            }
        }

        class Juego {
            constructor() {
                this.jugadores = [];
                this.jugadoresSobrantes = [];
                this.frase = [];
            }

            agregarJugador(jugador) {
                this.jugadores.push(jugador);
                return true;
            }

            elegirOrden() {
                for (let i = this.jugadores.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [this.jugadores[i], this.jugadores[j]] = [this.jugadores[j], this.jugadores[i]];
                }
                this.jugadoresSobrantes = [...this.jugadores];
            }

            imprimirJugadores() {
                let mensaje = this.jugadores.map((jugador, index) => `${index + 1}. ${jugador.toString()}`).join('\n');
                alert(mensaje);
            }

            iniciarJuego() {
                this.frase = [];
                let eliminados = [];
                alert("El juego ha comenzado!");
                this.elegirOrden();
                let mensaje = "Orden de los jugadores:\n" + this.jugadores.map((jugador, index) => `${index + 1}. ${jugador.toString()}`).join('\n');
                alert(mensaje);

                while (this.jugadoresSobrantes.length > 1) {
                    for (let i = 0; i < this.jugadoresSobrantes.length; i++) {
                        let jugador = this.jugadoresSobrantes[i];
                        alert(`Es el turno de ${jugador.nombre}`);
                        alert(`Frase actual: ${this.frase.join(" ")}`);

                        let startTime = Date.now();
                        let input = prompt("Ingrese la frase:");
                        let endTime = Date.now();

                        let timeTaken = (endTime - startTime) / 1000.0;
                        jugador.sumarTiempo(timeTaken);

                        let palabras = input.split(" ");
                        let error = this.comprobarError(palabras, i);

                        for (let j = 0; j < this.jugadoresSobrantes.length; j++) {
                            if (j !== i) {
                                let calificador = this.jugadoresSobrantes[j];
                                let decision;
                                do {
                                    decision = prompt(`${calificador.nombre} está calificando la frase de ${jugador.nombre}\nTecla de aceptación: ${calificador.teclaAceptacion}, Tecla de rechazo: ${calificador.teclaRechazo}\n¿La frase es correcta? (aceptar/rechazar): `);
                                    if (decision !== calificador.teclaAceptacion && decision !== calificador.teclaRechazo) {
                                        alert("Entrada inválida. Por favor, ingrese solo la tecla de aceptación o rechazo.");
                                    }
                                } while (decision !== calificador.teclaAceptacion && decision !== calificador.teclaRechazo);
                                let calificacion = decision === calificador.teclaAceptacion;
                                this.calificar(j, error, calificacion);
                            }
                        }

                        if (error) {
                            alert(`La frase fue rechazada. ${jugador.nombre} ha sido eliminado.`);
                            eliminados.push(this.jugadoresSobrantes.splice(i, 1)[0]);
                            i--;
                        } else {
                            alert("La frase fue aceptada.");
                        }

                        let sb = "Puntajes y tiempos actuales:\n";
                        this.jugadoresSobrantes.sort((j1, j2) => j2.puntuacion - j1.puntuacion);
                        for (let j of this.jugadoresSobrantes) {
                            sb += `${j.nombre} - Puntaje: ${j.puntuacion}, Tiempo: ${j.tiempo}\n`;
                        }
                        alert(sb);
                    }

                    this.eliminarJugadorConMenorPuntaje();
                }

                alert("El juego ha terminado!");
                let sb = "Resultados finales:\n";
                eliminados.push(...this.jugadoresSobrantes);
                eliminados.sort((j1, j2) => j2.puntuacion - j1.puntuacion);
                for (let j of eliminados) {
                    sb += `${j.nombre} - Puntaje: ${j.puntuacion}, Tiempo: ${j.tiempo}\n`;
                }
                alert(sb);

                if (eliminados.length > 0) {
                    let ganador = eliminados[0];
                    alert(`El ganador es: ${ganador.nombre} con un puntaje de ${ganador.puntuacion}`);
                }

                MenuJuego.menuPrincipal();
            }

            eliminarJugadorConMenorPuntaje() {
                if (this.jugadoresSobrantes.length === 0) return;

                let menorPuntaje = Math.min(...this.jugadoresSobrantes.map(j => j.puntuacion));
                let id = this.jugadoresSobrantes.findIndex(j => j.puntuacion === menorPuntaje);

                if (id !== -1) {
                    alert(`Se eliminó al jugador: ${this.jugadoresSobrantes[id].nombre} por tener el menor puntaje...`);
                    this.jugadoresSobrantes.splice(id, 1);
                }
            }

            calificar(i, error, calificacion) {
                if (error) {
                    if (calificacion) {
                        this.jugadoresSobrantes[i].puntuar(-0.5);
                    } else {
                        this.jugadoresSobrantes[i].puntuar(0.5);
                    }
                } else {
                    if (calificacion) {
                        this.jugadoresSobrantes[i].puntuar(-0.5);
                    } else {
                        this.jugadoresSobrantes[i].puntuar(0.5);
                    }
                }
            }

            comprobarError(frase, jugador) {
                if ((frase.length) - this.frase.length > 1) {
                    return true;
                } else if ((frase.length) < this.frase.length) {
                    return true;
                } else if ((frase.length) === this.frase.length) {
                    return true;
                } else {
                    if (this.frase.length === 0) {
                        let ultimaPalabra = frase[frase.length - 1];
                        this.frase.push(ultimaPalabra);
                        this.jugadoresSobrantes[jugador].puntuar(1);
                        return false;
                    } else {
                        let equivocaciones = 0;
                        for (let i = 0; i < this.frase.length; i++) {
                            if (frase[i].toLowerCase() !== this.frase[i].toLowerCase()) {
                                equivocaciones++;
                            }
                        }
                        if (equivocaciones > 0) {
                            return true;
                        } else {
                            this.frase.push(frase[frase.length - 1]);
                            this.jugadoresSobrantes[jugador].puntuar(1);
                            return false;
                        }
                    }
                }
            }
        }

        class MenuJuego {
            constructor(juego) {
                MenuJuego.juego = juego;
            }

            static registrarJugador() {
                let nombre = prompt("Nombre del jugador:");
                while (!nombre || nombre.trim() === "") {
                    alert("El nombre no puede estar vacío. Inténtelo de nuevo.");
                    nombre = prompt("Nombre del jugador:");
                }

                let teclaA = prompt("Tecla de aceptación:");
                while (!teclaA || teclaA.trim() === "") {
                    alert("La tecla de aceptación no puede estar vacía. Inténtelo de nuevo.");
                    teclaA = prompt("Tecla de aceptación:");
                }

                let teclaR = prompt("Tecla de rechazo:");
                while (!teclaR || teclaR.trim() === "") {
                    alert("La tecla de rechazo no puede estar vacía. Inténtelo de nuevo.");
                    teclaR = prompt("Tecla de rechazo:");
                }

                if (MenuJuego.juego.agregarJugador(new Jugador(nombre, teclaA, teclaR))) {
                    alert("Jugador registrado con éxito!!");
                } else {
                    alert("No se pudo registrar el jugador");
                }
            }

            static editarJugador(op) {
                if (op < MenuJuego.juego.jugadores.length && op >= 0) {
                    let nombre = prompt("Nombre del jugador:");
                    let teclaA = prompt("Tecla de aceptación:");
                    let teclaR = prompt("Tecla de rechazo:");
                    MenuJuego.juego.jugadores[op].nombre = nombre;
                    MenuJuego.juego.jugadores[op].teclaAceptacion = teclaA;
                    MenuJuego.juego.jugadores[op].teclaRechazo = teclaR;
                    alert("Jugador actualizado con éxito!!");
                    MenuJuego.juego.imprimirJugadores();
                } else {
                    alert("No se puede editar jugador fuera de rango");
                }
            }

            static eliminarJugador(op) {
                if (op < MenuJuego.juego.jugadores.length && op >= 0) {
                    MenuJuego.juego.jugadores.splice(op, 1);
                    alert("Jugador eliminado con éxito!!");
                } else {
                    alert("No se puede eliminar jugador fuera de rango");
                }
            }

            static menuPrincipal() {
                let opcion = 0;
                do {
                    let input = prompt(
                        "**************************************************\n" +
                        "JUEGO DE LA FRASE INTERMINABLE\n" +
                        "**************************************************\n" +
                        "1.- Jugadores\n" +
                        "2.- Iniciar nuevo juego\n" +
                        "3.- Salir\n" +
                        "Por favor, seleccione una opción (1-3):"
                    );
                    opcion = parseInt(input);
                    switch (opcion) {
                        case 1:
                            MenuJuego.menuRegistro();
                            break;
                        case 2:
                            MenuJuego.verificarJugadores();
                            break;
                        case 3:
                            alert("Hasta pronto!!");
                            break;
                        default:
                            alert("Opción no válida. Por favor, seleccione una opción (1-3).");
                            break;
                    }
                } while (opcion !== 3);
            }

            static verificarJugadores() {
                if (MenuJuego.juego.jugadores.length > 1) {
                    MenuJuego.juego.iniciarJuego();
                } else {
                    alert("No hay suficiente cantidad de jugadores para comenzar el juego");
                }
            }

            static menuRegistro() {
                let opcion = 0;
                do {
                    let input = prompt(
                        "*******************************************\n" +
                        "MENU REGISTRO JUGADORES\n" +
                        "*******************************************\n" +
                        "1.- Registrar jugador\n" +
                        "2.- Jugadores registrados\n" +
                        "3.- Editar jugador\n" +
                        "4.- Eliminar jugador\n" +
                        "5.- Salir\n" +
                        "Por favor, seleccione una opción (1-5):"
                    );
                    opcion = parseInt(input);
                    switch (opcion) {
                        case 1:
                            MenuJuego.registrarJugador();
                            break;
                        case 2:
                            if (MenuJuego.juego.jugadores.length === 0) {
                                alert("No hay jugadores registrados.");
                            } else {
                                MenuJuego.juego.imprimirJugadores();
                            }
                            break;
                        case 3:
                            if (MenuJuego.juego.jugadores.length === 0) {
                                alert("No hay jugadores registrados.");
                            } else {
                                MenuJuego.juego.imprimirJugadores();
                                input = prompt(`Seleccione jugador a editar (1-${MenuJuego.juego.jugadores.length}):`);
                                let op = parseInt(input);
                                MenuJuego.editarJugador(op - 1);
                            }
                            break;
                        case 4:
                            if (MenuJuego.juego.jugadores.length === 0) {
                                alert("No hay jugadores registrados.");
                            } else {
                                MenuJuego.juego.imprimirJugadores();
                                input = prompt(`Seleccione jugador a eliminar (1-${MenuJuego.juego.jugadores.length}):`);
                                let op = parseInt(input);
                                MenuJuego.eliminarJugador(op - 1);
                            }
                            break;
                        case 5:
                            return;
                        default:
                            alert("Opción no válida. Por favor, seleccione una opción (1-5).");
                            break;
                    }
                } while (opcion !== 5);
            }
        }

        document.addEventListener("DOMContentLoaded", () => {
            let menu = new MenuJuego(new Juego());
            menu.menuPrincipal();
        });
    </script>
</body>
</html>
