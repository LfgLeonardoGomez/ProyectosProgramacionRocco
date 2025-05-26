# Usa una imagen oficial de Node.js
FROM node:18

# Crea y define el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el package.json y package-lock.json si lo tenés
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código del backend
COPY . .

# Expone el puerto (por defecto, usarás 3000)
EXPOSE 3000

# Comando para correr la app
CMD ["node", "index.js"]
