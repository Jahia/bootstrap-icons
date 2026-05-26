package org.jahiacommunity.modules.bootstrap.icons;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.WordUtils;
import org.springframework.core.io.ClassPathResource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;



import java.io.IOException;

public class Functions {
    private static final Logger logger = LoggerFactory.getLogger(Functions.class);

    public static String getSvg(String name, String style) {
        return getSvg(name, style, false);
    }

    public static String getSvg(String name, String style, boolean decorative) {
        try {
            String html = IOUtils.toString(new ClassPathResource(String.format("img/%s.svg", name)).getInputStream());
            Document doc = Jsoup.parseBodyFragment(html);
            Element svgElement = doc.selectFirst("svg");
            if (svgElement == null) {
                logger.warn("No <svg> root found in {}", name);
                return StringUtils.EMPTY;
            }
            svgElement.removeAttr("width").removeAttr("height");
            if (!"auto".equals(style) && !StringUtils.isEmpty(style)) {
                svgElement.attr("style", style);
            }
            if (decorative) {
                svgElement.attr("aria-hidden", "true");
                svgElement.attr("focusable", "false");
            } else {
                String label = StringUtils.capitalize(name.replace('-', ' '));
                svgElement.attr("role", "img");
                svgElement.attr("aria-label", label);
            }
            return svgElement.outerHtml();
        } catch (IOException e) {
            logger.error("Could not get SVG", e);
            return StringUtils.EMPTY;
        }
    }

    public static String iconLabel(String name) {
        return WordUtils.capitalize(name.replace('-', ' '));
    }

}
