<%@ taglib prefix="bi" uri="https://getbootstrap.com/taglibs" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="template" uri="http://www.jahia.org/tags/templateLib" %>
<%@ taglib prefix="jcr" uri="http://www.jahia.org/tags/jcr" %>

<c:set var="usage" value="${currentNode.properties.usage.string}"/>
<c:set var="bootstrapIcon" value="${currentNode.properties.bootstrapIcon.string}"/>

<c:if test="${jcr:isNodeType(currentNode,'bootstrapiconsmix:iconWidth')}">
    <c:set var="iconWidth" value="${currentNode.properties.iconWidth.string}"/>
    <c:choose>
        <c:when test="${iconWidth eq '100'}">
            <c:set var="widthStyle" value="width:100%;height:auto"/>
        </c:when>
        <c:when test="${iconWidth eq '75'}">
            <c:set var="widthStyle" value="width:75%;height:auto"/>
        </c:when>
        <c:when test="${iconWidth eq '50'}">
            <c:set var="widthStyle" value="width:50%;height:auto"/>
        </c:when>
        <c:when test="${iconWidth eq '25'}">
            <c:set var="widthStyle" value="width:25%;height:auto"/>
        </c:when>
    </c:choose>
</c:if>
<c:choose>
    <c:when test="${usage eq 'embedded'}">
        ${bi:getSvg(bootstrapIcon,widthStyle)}
    </c:when>
    <c:when test="${usage eq 'sprite'}">
        <svg class="bi" fill="currentColor" style="${widthStyle}" viewbox="0 0 16 16">
            <use xlink:href="${url.currentModule}/icons/bootstrap-icons.svg#${bootstrapIcon}"/>
        </svg>
    </c:when>
    <c:when test="${usage eq 'external-image'}">
        <img src="${url.currentModule}/img/${bootstrapIcon}.svg" style="${widthStyle}" alt="${bootstrapIcon}"/>
    </c:when>
    <c:when test="${usage eq 'icon-font'}">
        <template:addResources type="css" resources="bootstrap-icons.css"/>
        <c:if test="${jcr:isNodeType(currentNode,'bootstrapiconsmix:fontSize')}">
            <c:set var="fontSize" value="${currentNode.properties.fontSize.string}"/>
            <c:choose>
                <c:when test="${fontSize eq 'xs'}">
                    <c:set var="fontStyle" value="font-size:.75em"/>
                </c:when>
                <c:when test="${fontSize eq 'sm'}">
                    <c:set var="fontStyle" value="font-size:.875em"/>
                </c:when>
                <c:when test="${fontSize eq 'lg'}">
                    <c:set var="fontStyle" value="font-size:1.33333em"/>
                </c:when>
                <c:when test="${fontSize eq 'default'}">
                    <%-- do nothing --%>
                </c:when>
                <c:otherwise>
                    <c:set var="fontStyle" value="font-size:${fontSize}em"/>
                </c:otherwise>
            </c:choose>
        </c:if>
        <c:if test="${! empty fontStyle}">
            <c:set var="style"><c:out value=" "/>style="${fontStyle}"</c:set>
        </c:if>
        <i class="bi-${bootstrapIcon}" viewBox="0 0 16 16" ${style}></i>
    </c:when>
    <c:otherwise>
        <c:if test="${renderContext.editMode}">
            Unexpected error: could not find a way to display your icon ${bootstrapIcon} using ${usage}
        </c:if>
    </c:otherwise>
</c:choose>



