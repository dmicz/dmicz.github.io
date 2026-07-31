module ImgAttrs
  IMG = %r{<img\b([^>]*?)\s*/?>}m
  SRC = /\bsrc\s*=\s*"([^"]*)"/

  def self.rewrite(output)
    seen = 0

    output.gsub(IMG) do |tag|
      attrs = Regexp.last_match(1)
      src = attrs[SRC, 1]
      dims = src && Webp.manifest[src]
      next tag unless dims

      seen += 1
      width, height = dims
      hints = if seen == 1
                'loading="eager" fetchpriority="high"'
              else
                'loading="lazy" decoding="async"'
              end
      webp = attrs.sub(SRC, %(src="#{src.sub(/\.[^.]+\z/, ".webp")}"))

      %(<img#{webp} width="#{width}" height="#{height}" #{hints}>)
    end
  end
end

Jekyll::Hooks.register %i[documents pages], :post_render do |doc|
  doc.output = ImgAttrs.rewrite(doc.output) if doc.output
end
