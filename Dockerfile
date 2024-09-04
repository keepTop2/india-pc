# 使用 Nginx 作为基础镜像
FROM nginx:alpine

# 将构建好的 Vue 应用复制到 Nginx 的默认路径
COPY dist /usr/share/nginx/html

# 暴露 Nginx 的 80 端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]