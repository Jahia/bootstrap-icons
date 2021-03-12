package org.jahiacommunity.modules.bootstrap.icons;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.core.io.ClassPathResource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

public class Functions {
    private static final Logger logger = LoggerFactory.getLogger(Functions.class);

    public static String getSvg(String name) {
        try {
            return IOUtils.toString(new ClassPathResource(String.format("img/%s.svg", name)).getInputStream());
        } catch (IOException e) {
            logger.error("Could not get SVG", e);
            return StringUtils.EMPTY;
        }
    }

}
