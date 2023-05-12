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
evaluar el impacto en los atributos de calidad mediante la comparación de diversas tecnologías. Estas tecnologías a utilizar son muy populares y de uso común en la industria, como lo son Node.js, Docker, Docker Compose, Nginx, Graphite, Grafana, Artillery, entre otras.
Lo que permite un primer pantallazo en el uso de estas herramientas y el aprendizaje de las mejores prácticas para la medición y visualización de datos.

Dicha API a su vez consume las siguientes APIs externas para dar información a los usuarios:
- [METAR API](https://www.aviationweather.gov/dataserver) 
- [Spaceflight News API](https://spaceflightnewsapi.net/)
- [Useless Facts](https://uselessfacts.jsph.pl/)

## Servicios 
En primer lugar se configuraron tanto docker-compose como Nginx para poder tener la aplicación corriendo en `localhost:5555/api` con los siguientes servicios:
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

* **Starting**: durante el perido de 30 segundos se realizan 4 request por segundo 
* **RampUp**: durante el periodo de 30 segundo se realizan 4 request de segundos incrementenado hasta  llegar a 50  
* **Plain**: durante el perido de 60 segundos se realizan 40 request port segundo 
* **RampDown**: durante el periodo de 30 segundos se realizan 50 request por segundo disminuyendo hasta llegar a 4 request por segundo 
* **Ending**: durante el periodo de 20 segundos se realizan 1 request por segundo.

#### Fact
* **Starting**: durante el perido de 30 segundos se realizan 4 request por segundo 
* **RampUp**: durante el periodo de 30 segundo se realizan 4 request de segundos incrementenado hasta  llegar a 18 request por segundo 
* **Plain**: durante el perido de 60 segundos se realizan 18 request por segundo 
* **RampDown**: durante el periodo de 30 segundos se realizan 18 request por segundo disminuyendo hasta llegar a 4 request por segundo 
* **Ending**: durante el periodo de 30 segundos se realizan 1 request por segundo.

#### Metar
* **Starting**: durante el perido de 20 segundos se realizan 4 request por segundo 
* **RampUp**: durante el periodo de 20 segundo se realizan 4 request de segundos incrementenado hasta  llegar a 25  
* **Plain**: durante el perido de 45 segundos se realizan 25 request por segundo 
* **RampDown**: durante el periodo de 20 segundos se realizan 25 request por segundo disminuyendo hasta llegar a 4 request por segundo 
* **Ending**: durante el periodo de 20 segundos se realizan 1 request por segundo.

#### Space News
* **Starting**: durante el perido de 30 segundos se realizan 4 requestpor segundo 
* **RampUp**: durante el periodo de 30 segundo se realizan 4 request de segundos incrementenado hasta  llegar a 10 
* **Plain**: durante el perido de 60 segundos se realizan 10 request port segundo 
* **RampDown**: durante el periodo de 30 segundos se realizan 10 request por segundo disminuyendo hasta llegar a 4 request por segundo 
* **Ending**: durante el periodo de 30 segundos se realizan 1 request por segundo.

### Stress Test
En estos casos se busca evaluar como se comporta el sistema con cargas más allá de su capacidad normal de operación, con la finalidad de verificar si el sistema es capaz de manejar situaciones de picos de tráfico o grandes volúmenes de datos.

#### Ping
* **Starting**: durante el perido de 30 segundos se realizan 10 requestpor segundo 
* **RampUp**: durante el periodo de 30 segundo se realizan 10 request de segundos incrementenado hasta  llegar a 180 
* **Plain**: durante el perido de 60 segundos se realizan 180 request por segundo 
* **RampDown**: durante el periodo de 30 segundos se realizan 180 request por segundo disminuyendo hasta llegar a 10 request por segundo 
* **Ending**: durante el periodo de 30 segundos se realizan 1 request por segundo.

#### Fact

* Starting: durante el perido de 30 segundos se realizan 10 requestpor segundo 
* RampUp: durante el periodo de 30 segundo se realizan 10 request de segundos incrementenado hasta  llegar a 150 
* Plain: durante el perido de 60 segundos se realizan 150 request por segundo 
* RampDown: durante el periodo de 30 segundos se realizan 150 request por segundo disminuyendo hasta llegar a 10 request por segundo 
* Ending: durante el periodo de 30 segundos se realizan 1 request por segundo.

#### Metar

* Starting: durante el perido de 20 segundos se realizan 4 request por segundo 
* RampUp: durante el periodo de 20 segundo se realizan 4 request de segundos incrementenado hasta  llegar a 130  
* Plain: durante el peridod de 45 segundos se realizan 130 request port segundo 
* RampDown: durante el periodo de 20 segundos se realizan 130 request por segundo disminuyendo hasta llegar a 4 request por segundo 
* Ending: durante el periodo de 20 segundos se realizan 1 request por segundo.

#### Space News

* **Starting**: durante el perido de 30 segundos se realizan 4 requestpor segundo 
* **RampUp**: durante el periodo de 30 segundo se realizan 4 request de segundos incrementenado hasta  llegar a 80  
* **Plain**: durante el perido de 60 segundos se realizan 80 request port segundo 
* **RampDown**: durante el periodo de 30 segundos se realizan 80 request por segundo disminuyendo hasta llegar a 4 request por segundo 
* **Ending**: durante el periodo de 30 segundos se realizan 1 request por segundo.

## Tácticas

### Caso base
En este caso se tiene la aplicación corriendo sin ninguna mejora adicional para poder utilizarla como comparación en las siguientes tácticas, además de familiarizarse con el entorno y las tecnologías.

#### Ping
Se puede observar como varían las diferentes etapas del escenario correspondiente en el que todas las peticiones son procesadas de manera satisfactoria con un máximo de 500 solicitudes

![](/assets/scenarioPingLoading.jpeg)

A su vez, en los siguientes gráficos, se puede ver que el Response Time tiene una media de 7.5ms y un valor máximo de 725ms en las primeras peticiones, esto se debe a que la aplicación no había terminado de lanzarse, por lo que demora y genera, del lado del cliente, una sensación de que la consulta lleva un mayor tiempo.

Por otro lado, el uso de memoria se mantiene casi constante mientras que el consumo de CPU sigue una distribución similar al escenario planteado. 
En este último gráfico se pueden notar ciertos picos en el consumo de memoria durante la fase *Plain* que corresponden exactamente en los momentos en el que el Response Time también fue mayor. 

![](/assets/responseTimeResourcesPingLoading.jpeg)

Ahora bien, veamos el caso en que realiza una prueba de stress 

![](/assets/pingStressScenario.jpeg)
![](/assets/pingStressResources.jpeg)

### Metar
Primero analizaremos el correspondiente escenario de Loading Test
![](/assets/scenarioMetarLoading.jpeg)

![](/assets/responseTimeResourseMetarLoading.jpeg)

![](/assets/appResponseMetarLoading.jpeg)

Ahora bien, vamos a comparar con las métricas obtenidas en los casos de Stress Test

![](/assets/metarStressScenario.jpeg)
![](/assets/metarResourcesStress.jpeg)
![](/assets/metarAppStress.jpeg)

### Space News
Si en la presente táctica corremos el escenario de Loading Test para el servicio de Space News obtenemos lo siguiente:
![](/assets/spacenews_sinCache_Loading.jpeg)

Podemos observar que a partir de la fase plana en donde tiene mayor tasa de peticiones, el servicio comienza a fallar, y mantiene un promedio de 53.8 de request con dicho estado.

Por otro lado el Response Time medio es un valor grande (7.13 segundos aproximadamente).

### Caché
Endpoints cacheados:
* /space_news
  
En el caso del endpoint /metar, esta información no se cachea ya que es información de tiempo real y puede ser importante mostrar la infomacion actualizada momento a momento. Y en el caso de /fact, no se cachea porque siempre debe devolverse un fact distinto salvo que lo repita la api. 

La cantidad de items que se guardan en el cache son 5 ya que son los titulos de las últimas 5 noticias que devuelve la api. 
En cuanto al llenado, se optó por la táctica de lazy population. Cada vez que un cliente llama a un endpoint y su información no se encuentra en el cache, la api cachea la misma para devolverla en los proximos segundos.

La información se guarda por 10 segundos en el caso de `/space_news`. 

Si se toma un item del cache se conserva hasta que expire. Redis elimina el valor automáticamente cuando este expira.

#### Space News
A continuación se muestran las estadísticas obtenidas con el escenario de *Loading Test*

![](/assets/scenarioSpaceLoading.jpeg)

![](/assets/responseTimeResourcesSNLoading.jpeg)

![](/assets/appSpaceNewsLoading.jpeg)

Si realizamos la misma táctica pero con los escenarios de estrés se obtiene lo siguiente

![](/assets/space_newsStressScenario.jpeg)
![](/assets/space_newsStressResources.jpeg)
![](/assets/space_news_app_stress.jpeg)

Podemos observar que tenemos picos en los tiempos de respuestas. En el gráfico de `APP endpoint de space news` vemos que hay mas metricas a medida que pasa el tiempo que en el caso del grafico de `API externa de space news` y esto ocurre porque cacheamos la información, haciendo menos requests a la api externa. Podemos ver que hay una diferencia de al menos 1000 ms en los tiempos de respuesta.  

El primer valor de respuesta tomado en el endpoint de la app es cercano a 1000 ms y este es el primer caso en el que no tenemos la info cacheada. Luego, en los tiempos en los que es cercano a cero, la info se fue obteniendo de la cache. Podemos ver que disminuye significativamente el tiempo de respuesta mejorando asi la `Performance`.

Si lo comparamos con la táctica base, es decir, sin cachear la información, podemos notar una mejor tasa de respuestas correctas. Siendo la tasa de error en las pruebas de carga sin caché mucho mayor hasta en el caso de pruebas de estrés con caché.

A su vez la diferencia del Response Time entre ambas tácticas es muy considerable, como se dijo anteriormente.

### Replicación
A continuación se realizan las mediciones de las métricas para el caso en el que se tienen 3 (tres) réplicas de nuestra aplicación. Para ello se explicitó en la configuración de Docker-Compose la creación de dichas instancias, y también se configuró Nginx para que distribuya la carga entre ellas aplicando la ténica de Round Robin.

Para poder realizar comparaciones de esta táctica con el caso de un nodo solo, se utilizó el escenario de estrés (*Stress Test*) para el servicio de Space News y se midieron los recursos utilizados.

### 1 Nodo
![](/assets/app-1-solo.png)
En la imagen anterior se puede observar que el único nodo tiene un consumo de CPU promedio de 1.49% y un 0.189% de memoria

### 3 Nodos
![](/assets/app-1.png)
![](/assets/app-2.png)
![](/assets/app-3.png)

Ahora bien, si analizamos los recursos utilizados para cada una de las tres réplicas podemos ver que el consumo de CPU baja considerablemente entre ambos casos, siendo el promedio menor al 0.5% para cada uno. Lo que indicaría una baja del uso de CPU casi al tercio del caso con un único servicio levantado.

Por otro lado, el uso de memoria se mantuvo casi constante siendo 0.189% en el caso de un solo nodo, contra 0.165% aproximadamente en cada una de las réplicas.

### 2 Nodos - 1 Nodo caido

Realizamos una prueba forzando la caida de un nodo (app-2) para analizar el comportamiento del Load Balancer del `nginx` y ver cómo impacta en la resolución de las request.

Previamente se corrió una prueba de stress sobre el endpoint `space_news` para tener de referencia el tiempo de respuesta y la cantidad de request completados y con errores

![](/assets/load_balancer_all_instances.png)

Luego, apagando la instancia `app-2`, volvió a correrse la misma prueba obteniendo el siguiente resultado

![](/assets/load_balancer_two_instances.png)

Se puede observar un resultado similar, por lo que entendemos que `nginx` realiza un buen trabajo para mantener la disponibilidad del sistema balanceando la carga a las instancias activas. De no ser así, como balancea la carga de manera Round Robin, al menos 1/3 de las request deberian haber fallado al tratar de enviarlas a la instancia `app-2`.

Por todo esto, concluimos que la táctica de **Replicacion** mejora la `Availability` y la `Performance`.

### Rate Limiting
Esta táctica es utilizada para limitar la cantidad de solicitudes que un usuario puede realizar en cierto período determinado. Para lograr dicho propósito se utilizó Nginx, cambiando las configuraciones para observar variaciones en las métricas.

En la siguiente línea podemos observar que se crea una zona en donde se almacenarán los contadores para el rate limit, con un tamaño de 10MB y una tasa de 10 solicitudes por segundo.

```Nginx
limit_req_zone $binary_remote_addr zone=api_rate_limit:10m rate=10r/s;
```

Por otro lado, se define que en caso de que se haya superado la tasa de solicitudes, el código de respuesta de Nginx sea _429 Too Many Requests_.

Si obtenemos las salidas al correr el escenario de Loading Test Ping, podemos observar como las requests son resueltas correctamente hasta casi llegando a la mitad de nuestra rampa ascendente, en donde la cantidad de solicitudes aceptadas corresponde a 100, lo cual se verifica con la configuración propuesta.

![](/assets/Ping-RateLimit-Nodelay.png)

Esta táctica afecta considerablemente al atributo de calidad de `Availability` ya que al limitar la cantidad de solicitudes que se procesan evita que el sistema se sobrecargue y se caiga, es decir, deje de estar disponible.

A su vez mejora el atributo de `Security` debido a que ayuda a prevenir ataques de denegación de servicio (DoS) y de otros tipos ataque que buscar sobrecargar al sistema mediante ráfagas de solicitudes.

### Async Design & Concurrency - Request Reply Asincrónico (Opcional)
Como tácticas opcionales elegimos *Async Design* y *Concurrency*, en el cual implementamos un Reques Reply Asincrónico. Para esto a travez del endpoint `/big_process` se simula un proceso de gran cómputo mediante un `sleep` de 10 segundos.


Se plantea resolver el problema del procesamiento sincrónico de un proceso pesado donde varios clientes consuman dicho endpoint, el cual dejaría esperando a los clientes varios segundos hasta que el servidor pueda procesar todas las request pendientes de resolver. Además, cuantos mas usuarios paralelamente consuman este servicio, mas demoraría en responder.

A travéz de estas tácticas se pretende mejorar los atributos de calidad `Scalability` y `Performance`.

Para esto, `/big_process` retornará un ID de procesamiento.

![](/assets/AsyncDesign-1.png)

El ID obtenido podrá ser utilizado por los clientes puedan consultar el estado de su proceso hasta su finalización y obtener su resultado.

#### AsyncDesign - Resultado Pendiente
![](/assets/AsyncDesign-2.png)

#### AsyncDesign - Resultado Terminado
![](/assets/AsyncDesign-3.png)

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
