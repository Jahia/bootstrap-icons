<%@ taglib prefix="bi" uri="https://getbootstrap.com/taglibs" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="template" uri="http://www.jahia.org/tags/templateLib" %>

<c:choose>
    <c:when test="${currentNode.properties.useIconFont.boolean}">
        <template:addResources type="css" resources="bootstrap-icons.css"/>
        <i class="bi-${currentNode.properties.bootstrapIcon.string}"></i>
    </c:when>
    <c:otherwise>
        ${bi:getSvg(currentNode.properties.bootstrapIcon.string)}
    </c:otherwise>
</c:choose>



