export default function AuthorSection({
    name = "Abhishek Adhikari",
    position = "SEO Expert & Developer",
    image = "/author.png",
    bio = "Passionate about creating free, accessible SEO tools to help businesses and individuals improve their online presence."
}) {
    return (
        <div className="card p-6 border-t-2 border-brand-500">
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                    <img
                        src={image}
                        alt={name}
                        className="w-20 h-20 rounded-full object-cover border-2 border-brand-500"
                        loading="lazy"
                    />
                </div>
                <div className="flex-1">
                    <a href="/author" className="hover:opacity-80 transition-opacity">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {name}
                        </h3>
                    </a>
                    <p className="text-sm text-brand-600 dark:text-brand-400 font-medium mb-2">
                        {position}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {bio}
                    </p>
                </div>
            </div>
        </div>
    );
}
