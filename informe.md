# Informe TP 1

## Integrantes
| Nombre | Padrón |
| ------ | ------ |
| María Sol Fontenla | 103870 |
| Agustina Segura | 104222 |
| Martín Nicolas Pérez | 97378 |
| Maximiliano Nahuel Romero Vázquez | 99118 |

## Objetivo
El presente trabajo consiste en la implmentación de un servicio HTPP en Node.js-Express que represente una API para poder 
evaluar el impacto en los atributos de calidad mediante la comparaciónde diversas tecnologías. Estas tecnologías a utilizar son muy populares y de uso común en la industria, como lo son Node.js, Docker, Docker Compose, Nginx, Graphite, Grafana, Artillery, entre otras.
Lo que permite un primer pantallazo en el uso de estas herramientas y el aprendizaje de las mejores prácticas para la medición y visualización de datos.

Dicha API a su vez consume las siguientes APIs externas para dar información a los usuarios:
- [METAR API](https://www.aviationweather.gov/dataserver) 
- [Spaceflight News API](https://spaceflightnewsapi.net/)
- [Useless Facts](https://uselessfacts.jsph.pl/)

## Servicios 
En primer lugar se configuraron tanto docker-componse como Nginx para poder tener la aplicación corriendo en `localhost:5555/api` con los siguientes servicios:
-  `/ping`: Healthcheck que devuelve siempre un valor constante, sin procesamiento alguno
-  `/metar?station=<code>`: invoca al reporte del estado meteorológico que se registra en el aeródromo `station` (código OACI) proviente de [METAR](http://www.bom.gov.au/aviation/data/education/metar-speci.pdf), retornarnolo en formato JSON.
-  `/space_news`: se devuelven los títulos de las últimas 5 noticias sobre actividad espacial de la API externa [Spaceflight News API](https://spaceflightnewsapi.net/).
-  `/fact`: consume la API externa de [Useless Facts](https://uselessfacts.jsph.pl/) devolviendo así 1 (un) hecho sin utilidad
- `/big_process`: Simulación de un proceso de gran cómputo. Utilizado para las tacticas opcionales.

## Vista Components & Connectors
A continuación se muestra el diagrama de Vista de Componentes y Conectores para el caso base, es decir, de un solo nodo, y para el caso en donde se tienen 3 (tres) _Réplicas_ de la API.

### Caso Base
Se puede observar que la consulta, ya sea mediante Artillery o desde un cliente, pasa primero por el proxy de Nginx quien le envía al servidor de origen la correspondiente petición.
Por otro lado, se tiene el servicio de Node.js quien le realiza a su vez peticiones a las APIs externas ya mencionadas anterioremente. 

![](/assets/VCC_Base.png)

### Caso con Replicación
La principal diferencia con el caso anterior es que se puede ver a Nginx funcionando como un Load Balancer distribuyendo la carga a cada una de las instancias de nuestro servicio.

![](/assets/VCC_Replicacion.png)

## Escenarios
Un escenario define los flujos de trabajo de prueba que se deben ejecutar en cada caso para poder así verificar la arquitectura de la aplicación y como impactan en los atributos de calidad en cada caso. 
Decidimos realizar dos grandes grupos de cargas de trabajo, los denominados _Loading Test_ y los llamados _Stress Test_, que describiremos a continuación.

### Loading Test

Es un tipo de prueba donde se va aumentando la craga del sistema hasta llegar a un valor umbral
#### Ping

##### Escenario 1
* **Starting**: durante el peridod de 30 segundos se realizan 4 request por segundo 
* **RampUp**: durante el periodo de 30 segundo se realizan 4 request de segundos incrementenado hasta  llegar a 50  
* **Plain**: durante el peridod de 60 segundos se realizan 40 request port segundo 
* **RampDown**: durante el periodo de 30 segundos se realizan 50 request por segundo disminuyendo hasta llegar a 4 request por segundo 
* **Ending**: durante el periodo de 20 segundos se realizan 1 request por segundo.

#### Fact
* **Starting**: durante el peridod de 30 segundos se realizan 4 request por segundo 
* **RampUp**: durante el periodo de 30 segundo se realizan 4 request de segundos incrementenado hasta  llegar a 18 request por segundo 
* **Plain**: durante el peridod de 60 segundos se realizan 18 request por segundo 
* **RampDown**: durante el periodo de 30 segundos se realizan 18 request por segundo disminuyendo hasta llegar a 4 request por segundo 
* **Ending**: durante el periodo de 30 segundos se realizan 1 request por segundo.

#### Metar
* **Starting**: durante el peridod de 20 segundos se realizan 4 request por segundo 
* **RampUp**: durante el periodo de 20 segundo se realizan 4 request de segundos incrementenado hasta  llegar a 25  
* **Plain**: durante el peridod de 45 segundos se realizan 25 request por segundo 
* **RampDown**: durante el periodo de 20 segundos se realizan 25 request por segundo disminuyendo hasta llegar a 4 request por segundo 
* **Ending**: durante el periodo de 20 segundos se realizan 1 request por segundo.

#### Space News
* **Starting**: durante el peridod de 30 segundos se realizan 4 requestpor segundo 
* **RampUp**: durante el periodo de 30 segundo se realizan 4 request de segundos incrementenado hasta  llegar a 10 
* **Plain**: durante el peridod de 60 segundos se realizan 10 request port segundo 
* **RampDown**: durante el periodo de 30 segundos se realizan 10 request por segundo disminuyendo hasta llegar a 4 request por segundo 
* **Ending**: durante el periodo de 30 segundos se realizan 1 request por segundo.

### Stress Test
En estos casos se busca evaluar como se comporta el sistema con cargas más allá de su capacidad normal de operación, con la finalidad de verificar si el sistema es capaz de manejar situaciones de picos de tráfico o grandes volúmenes de datos.

#### Ping
* **Starting**: durante el peridod de 30 segundos se realizan 10 requestpor segundo 
* **RampUp**: durante el periodo de 30 segundo se realizan 10 request de segundos incrementenado hasta  llegar a 400 
* **Plain**: durante el peridod de 60 segundos se realizan 400 request por segundo 
* **RampDown**: durante el periodo de 30 segundos se realizan 400 request por segundo disminuyendo hasta llegar a 10 request por segundo 
* **Ending**: durante el periodo de 30 segundos se realizan 1 request por segundo.

#### Fact
* **Starting**: durante el peridod de 30 segundos se realizan 10 requestpor segundo 
* **RampUp**: durante el periodo de 30 segundo se realizan 10 request de segundos incrementenado hasta  llegar a 300 
* **Plain**: durante el peridod de 60 segundos se realizan 300 request por segundo 
* **RampDown**: durante el periodo de 30 segundos se realizan 300 request por segundo disminuyendo hasta llegar a 10 request por segundo 
* **Ending**: durante el periodo de 30 segundos se realizan 1 request por segundo.

#### Metar
* **Starting**: durante el peridod de 20 segundos se realizan 4 request por segundo 
* **RampUp**: durante el periodo de 20 segundo se realizan 4 request de segundos incrementenado hasta  llegar a 120  
* **Plain**: durante el peridod de 45 segundos se realizan 120 request port segundo 
* **RampDown**: durante el periodo de 20 segundos se realizan 120 request por segundo disminuyendo hasta llegar a 4 request por segundo 
* **Ending**: durante el periodo de 20 segundos se realizan 1 request por segundo.

#### Space News

* **Starting**: durante el peridod de 30 segundos se realizan 4 requestpor segundo 
* **RampUp**: durante el periodo de 30 segundo se realizan 4 request de segundos incrementenado hasta  llegar a 18  
* **Plain**: durante el peridod de 60 segundos se realizan 18 request port segundo 
* **RampDown**: durante el periodo de 30 segundos se realizan 18 request por segundo disminuyendo hasta llegar a 4 request por segundo 
* **Ending**: durante el periodo de 30 segundos se realizan 1 request por segundo.

## Tácticas

### Caso base

### Caché
Endpoints cacheados:
* `/space_news`
* `/fact`
  
En el caso del endpoint /metar, esta información no se cachea ya que es información de tiempo real y puede ser importante mostrar la infomacion actualizada momento a momento. 

La cantidad de items que se guardan en el cache son dos, ya que `/space_news` y `/fact` solo devuelven un valor.

En cuanto al llenado, se optó por la táctica de lazy population. Cada vez que un cliente llama a un endpoint y su información no se encuentra en el cache, la api cachea la misma para devolverla en los proximos segundos.

La información se guarda por 10 segundos en el caso de `/space_news` y en el caso de `/fact` 30 segundos. 

Si se toma un item del cache se conserva hasta que expire. Redis elimina el valor automáticamente cuando este expira.

### Replicación
A continuación se realizan las mediciones de las métricas para el caso en el que se tienen 3 (tres) réplicas de nuestra aplicación. Para ello se explicitó en la configuración de Docker-Compose la creación de dichas instancias, y también se configuró Nginx para que distribuya la carga entre ellas aplicando la ténica de Round Robin.

### Rate Limiting
Esta táctica es utilizada para limitar la cantidad de solicitudes que un usuario puede realizar en cierto período determinado. Para lograr dicho propósito se utilizó Nginx, cambiando las configuraciones para observar variaciones en las métricas.

En la siguiente línea podemos observar que se crea una zona en donde se almacenarán los contadores para el rate limit, con un tamaño de 10MB y una tasa de 10 solicitudes por segundo.

```Nginx
limit_req_zone $binary_remote_addr zone=api_rate_limit:10m rate=10r/s;
```

Por otro lado, se define que en caso de que se haya superado la tasa de solicitudes, el código de respuesta de Nginx sea _429 Too Many Requests_.

Si obtenemos las salidas al correr el escenario de Loading Test Ping, podemos observar como las requests son resueltas correctamente hasta casi llegando a la mitad de nuestra rampa ascendente, en donde la cantidad de solicitudes aceptadas corresponde a 100, lo cual se verifica con la configuración propuesta.

![](/assets/Ping-RateLimit-Nodelay.png)

### Async Design - Request Reply Asincrónico (Opcional)
Como tactica opcional elegimos *Async Design*, en el cual implementamos un Reques Reply Asincrónico. Para esto a travez del endpoint `/big_process` se simula un proceso de gran cómputo mediante un `sleep` de 10 segundos.

Se plantea resolver el problema del procesamiento sincrónico en caso de que varios clientes consuman dicho endpoint, el cual dejaría esperando a los clientes varios segundos hasta que el servidor pueda procesar todas las request pendientes de resolver.

Para esto, `/big_process` retornará un ID de procesamiento.

![](/assets/AsyncDesign-1.png)

El ID obtenido podrá ser utilizado por los clientes puedan consultar el estado de su proceso hasta su finalización y obtener su resultado.

#### AsyncDesign - Resultado Pendiente
![](/assets/AsyncDesign-2.png)

#### AsyncDesign - Resultado Terminado
![](/assets/AsyncDesign-3.png)

## Cache

Endpoints cacheados:
* /space_news
* /fact
  
En el caso del endpoint /metar, esta información no se cachea ya que es información de tiempo real y puede ser importante mostrar la infomacion actualizada momento a momento. 

La cantidad de items que se guardan en el cache son dos, ya que /space_news y /fact solo devuelven un valor.

En cuanto al llenado, se optó por la táctica de lazy population. Cada vez que un cliente llama a un endpoint y su información no se encuentra en el cache, la api cachea la misma para devolverla en los proximos segundos.

La información se guarda por 10 segundos en el caso de /space_news y en el caso de /fact 30 segundos. 

Si se toma un item del cache se conserva hasta que expire. Redis elimina el valor automáticamente cuando este expira.

## Troubleshooting

Se han encontrado conflictos a la hora de registrar métricas en graphite enviadas desde las aplicaciones y cAdvisor al mismo tiempo. 

Para solventar esto se ha optado por tener configurado en el entorno de docker 2 instancias de graphite, como se muestra en el codigo abajo:

```
    graphite:
        image: graphiteapp/graphite-statsd:1.1.10-4
        container_name: 1c23-tp-1-graphite-1
        ports:
            - "8090:80"
            - "8125:8125/udp"
            - "8126:8126"
        volumes:
            - ./statsd.config.js:/opt/statsd/config.js
            - ./graphite.storage-schemas.conf:/opt/graphite/conf/storage-schemas.conf
        networks:
            - tp1_net

    graphite2:
        image: graphiteapp/graphite-statsd:1.1.10-4
        container_name: 1c23-tp-1-graphite-2
        ports:
            - "8091:80"
            - "9125:8125/udp"
            - "9126:8126"
        volumes:
            - ./statsd.config.js:/opt/statsd/config.js
            - ./graphite.storage-schemas.conf:/opt/graphite/conf/storage-schemas.conf
        networks:
            - tp1_net
```

Los componentes que envian metricas a la instancia `graphite` son
- app-1
- app-2
- app-3
- Artillery

Mientras que `graphite2` recibe unicamente metricas de cAdvisor.

Todas las métricas recolectadas podrán visualizarse en el mismo dashboard de **grafana**, para ello se debe tener configurado los datasource de la siguiente manera:

![](/assets/Datasource_Grafana_Config.png)

### Graphite
![](/assets/Graphite_Config_Grafana.png)

### Graphite2
![](/assets/Graphite2_Config_Grafana.png)

### Variables

Se han ajustado las variables para poder coincidir los nombres de los contenedores de Docker

![](/assets/Variables_Grafana_Config.png)

![](/assets/Variables_Grafana_Config_2.png)

### Asignación de Datasources

Puede ocurrir que al momento de importar el Dashboard no se muestre data en ninguno de los Paneles.

Para esto, hay que actualizar la configuración del Panel para que tomen el datasource correctamente

![](/assets/Select_Datasource_Grafana_Config.png)

- El panel `resources` utiliza el Datasource `Graphite2`
- El resto de los paneles utiliza el Datasource `Graphite`
