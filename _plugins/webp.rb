require "fastimage"
require "open3"
require "pathname"

module Webp
  MAX_WIDTH = 1400
  QUALITY = 82
  SOURCE_EXTS = %w[.png .jpg .jpeg].freeze

  def self.manifest
    @manifest ||= {}
  end

  def self.generate(site)
    root = File.join(site.source, "assets", "img")
    return unless Dir.exist?(root)

    converted = 0

    Dir.glob(File.join(root, "**", "*")).each do |src|
      next unless SOURCE_EXTS.include?(File.extname(src).downcase)

      dims = FastImage.size(src)
      unless dims
        Jekyll.logger.warn "WebP:", "could not read dimensions of #{File.basename(src)}"
        next
      end

      width, height = dims
      target_w = [width, MAX_WIDTH].min
      target_h = (height * target_w.to_f / width).round
      key = url_for(site, src)
      dest = src.sub(/\.[^.]+\z/, ".webp")

      manifest[key] = [target_w, target_h]
      next if File.exist?(dest) && File.mtime(dest) >= File.mtime(src)

      cmd = ["cwebp", "-quiet", "-q", QUALITY.to_s]
      cmd.concat(["-resize", target_w.to_s, "0"]) if target_w < width
      cmd.concat([src, "-o", dest])

      _out, err, status = Open3.capture3(*cmd)
      if status.success?
        converted += 1
      else
        manifest.delete(key)
        Jekyll.logger.warn "WebP:", "#{File.basename(src)} failed: #{err.strip}"
      end
    end

    Jekyll.logger.info "WebP:", "generated #{converted} derivative(s)" if converted.positive?
  end

  def self.url_for(site, abs)
    "/" + Pathname.new(abs).relative_path_from(Pathname.new(site.source)).to_s
  end
end

Jekyll::Hooks.register :site, :after_init do |site|
  Webp.generate(site)
end
