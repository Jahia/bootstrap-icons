package org.jahiacommunity.modules.bootstrap.icons;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
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
        try {
            String html = IOUtils.toString(new ClassPathResource(String.format("img/%s.svg", name)).getInputStream());
            Document doc = Jsoup.parseBodyFragment(html);
            doc.select("svg").removeAttr("width").removeAttr("height");
            if (! "auto".equals(style)) {
                doc.select("svg").attr("style", style);
            }
            return doc.html();
        } catch (IOException e) {
            logger.error("Could not get SVG", e);
            return StringUtils.EMPTY;
        }
    }

}
