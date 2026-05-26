<%@ taglib prefix="bi" uri="https://getbootstrap.com/taglibs" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="template" uri="http://www.jahia.org/tags/templateLib" %>
<%@ taglib prefix="jcr" uri="http://www.jahia.org/tags/jcr" %>

<c:set var="usage" value="${currentNode.properties.usage.string}"/>
<c:set var="bootstrapIcon" value="${currentNode.properties.bootstrapIcon.string}"/>
<c:set var="decorative" value="${currentNode.properties.decorative.boolean}"/>

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
<c:if test="${not empty widthStyle}">
    <c:set var="widthStyleAttr"><c:out value=" "/>style="${widthStyle}"</c:set>
</c:if>
<c:choose>
    <c:when test="${usage eq 'embedded'}">
        ${bi:getSvgA11y(bootstrapIcon,widthStyle,decorative)}
    </c:when>
    <c:when test="${usage eq 'sprite'}">
        <c:choose>
            <c:when test="${decorative}">
                <svg class="bi" fill="currentColor"${widthStyleAttr} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                    <use xlink:href="${url.currentModule}/icons/bootstrap-icons.svg#${bootstrapIcon}"/>
                </svg>
            </c:when>
            <c:otherwise>
                <svg class="bi" fill="currentColor"${widthStyleAttr} viewBox="0 0 16 16" role="img" aria-label="${bi:iconLabel(bootstrapIcon)}">
                    <use xlink:href="${url.currentModule}/icons/bootstrap-icons.svg#${bootstrapIcon}"/>
                </svg>
            </c:otherwise>
        </c:choose>
    </c:when>
    <c:when test="${usage eq 'external-image'}">
        <c:choose>
            <c:when test="${decorative}">
                <img src="${url.currentModule}/img/${bootstrapIcon}.svg"${widthStyleAttr} alt=""/>
            </c:when>
            <c:otherwise>
                <img src="${url.currentModule}/img/${bootstrapIcon}.svg"${widthStyleAttr} alt="${bi:iconLabel(bootstrapIcon)}"/>
            </c:otherwise>
        </c:choose>
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
        <c:choose>
            <c:when test="${decorative}">
                <i class="bi-${bootstrapIcon}" aria-hidden="true" focusable="false" ${style}></i>
            </c:when>
            <c:otherwise>
                <i class="bi-${bootstrapIcon}" role="img" aria-label="${bi:iconLabel(bootstrapIcon)}" ${style}></i>
            </c:otherwise>
        </c:choose>
    </c:when>
    <c:otherwise>
        <c:if test="${renderContext.editMode}">
            Unexpected error: could not find a way to display your icon ${bootstrapIcon} using ${usage}
        </c:if>
    </c:otherwise>
</c:choose>



