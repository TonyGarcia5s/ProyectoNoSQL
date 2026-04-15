const { Router } = require('express');

const router = Router();

router.use('/grupos', require('./grupo.routes'));
router.use('/inventario', require('./inventario.routes'));
router.use('/comunicados', require('./comunicado.routes'));
router.use('/docentes', require('./docente.routes'));
router.use('/materias', require('./materia.routes'));
router.use('/estudiantes', require('./estudiante.routes'));
router.use('/matriculas', require('./matricula.routes'));
router.use('/cursos', require('./curso.routes'));
router.use('/notas', require('./nota.routes'));
router.use('/asistencia', require('./asistencia.routes'));
router.use('/pagos', require('./pago.routes'));
router.use('/padres', require('./padre.routes'));
router.use('/aulas', require('./aula.routes'));
router.use('/horarios', require('./horario.routes'));
router.use('/evaluaciones', require('./evaluacion.routes'));

module.exports = router;
