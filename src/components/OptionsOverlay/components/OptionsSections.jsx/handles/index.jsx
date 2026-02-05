export const getTextContent = (section,currentText) => {
    if (currentText === 'initial') {
        return {
            heading: section === "EMPRESA" ? "Simplifica su gestión" :
                section === "PROFESIONAL" ? "Impulsa tu carrera" :
                    "Haz que la tecnología trabaje para ti",
            description: section === "EMPRESA" ? "Delegá proyectos completos, o la selección y supervisión de tus profesionales. Fortalecé tus puntos débiles con nuestras consultorías, o revalidá procesos en una auditoría. Incorporá automatización inteligente para reducir la carga operativa y tener un control total y mas eficiente." :
                section === "PROFESIONAL" ? "Forma parte de un ecosistema colaborativo donde los profesionales IT pueden compartir, delegar tareas y aprender unos de otros. Optimiza tu carga de trabajo, gestiona proyectos de forma eficiente y accede a oportunidades internacionales." :
                    "El mundo cambió y digitalizarse es la clave para crecer. En Apolo, creamos webs, apps, diseños personalizados y herramientas digitales que te ayudan a atraer, gestionar y fidelizar clientes de manera más eficiente."
        };
    } else {
        return {
            heading: section === "EMPRESA" ? "Nuevo contenido empresarial" :
                section === "PROFESIONAL" ? "" :
                    "Nuevas soluciones exclusivas",
            description: section === "EMPRESA" ? "Descubre cómo nuestras soluciones empresariales pueden transformar tu negocio con herramientas avanzadas y soporte especializado." :
                section === "PROFESIONAL" ? `Sabemos lo que pasa cuando hay más demanda que tiempo y decir que 'no' es perder oportunidades.También entendemos lo que significa tener talento, pero no  la oportunidad de explotarlo. \nPor eso creamos un modelo de trabajo en colavoracion, para conectar oportunidades con nuestra red de profesionales, potenciando el crecimiento en mayoria.` : `Explora nuestras soluciones premium diseñadas específicamente para clientes que buscan lo mejor en tecnología y diseño.`
        };
    }
};